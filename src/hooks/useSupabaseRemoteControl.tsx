
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

interface RemoteDevice {
  id: string;
  device_code: string;
  device_name: string;
  user_id: string;
  is_active: boolean;
  created_at: string;
  last_seen: string;
}

interface RemoteCommand {
  id: string;
  device_code: string;
  command_type: string;
  command_data: any;
  executed: boolean;
  created_at: string;
}

interface RemoteControlState {
  deviceCode: string | null;
  connectedDeviceCode: string | null;
  isPresentation: boolean;
  isRemote: boolean;
  commands: RemoteCommand[];
}

export const useSupabaseRemoteControl = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [state, setState] = useState<RemoteControlState>({
    deviceCode: null,
    connectedDeviceCode: null,
    isPresentation: false,
    isRemote: false,
    commands: []
  });

  // Generate a unique device code for presentation mode
  const generateDeviceCode = useCallback(async () => {
    if (!user) return null;

    const deviceCode = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const { data, error } = await supabase
      .from('remote_devices')
      .insert({
        device_code: deviceCode,
        device_name: `${navigator.userAgent.split(' ')[0]} Presentation`,
        user_id: user.id,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating device:', error);
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      deviceCode: deviceCode,
      isPresentation: true 
    }));

    return deviceCode;
  }, [user]);

  // Connect to a presentation device as remote
  const connectToDevice = useCallback(async (deviceCode: string) => {
    if (!user) throw new Error('User must be logged in');

    // Verify device exists and is active
    const { data, error } = await supabase
      .from('remote_devices')
      .select('*')
      .eq('device_code', deviceCode)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('Device not found or inactive');
    }

    setState(prev => ({ 
      ...prev, 
      connectedDeviceCode: deviceCode,
      isRemote: true 
    }));

    toast({
      title: "Connected",
      description: `Connected to ${data.device_name}`,
    });

    return data;
  }, [user, toast]);

  // Send command to connected device
  const sendCommand = useCallback(async (commandType: string, commandData?: any) => {
    if (!state.connectedDeviceCode) {
      console.error('No device connected');
      return;
    }

    const { error } = await supabase
      .from('remote_commands')
      .insert({
        device_code: state.connectedDeviceCode,
        command_type: commandType,
        command_data: commandData || {}
      });

    if (error) {
      console.error('Error sending command:', error);
      return;
    }

    console.log('Command sent:', commandType, commandData);
  }, [state.connectedDeviceCode]);

  // Listen for commands on this device (for presentation mode)
  useEffect(() => {
    if (!state.deviceCode || !state.isPresentation) return;

    console.log('Setting up command listener for device:', state.deviceCode);

    const commandChannel = supabase
      .channel(`device_${state.deviceCode}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'remote_commands',
          filter: `device_code=eq.${state.deviceCode}`
        }, 
        async (payload) => {
          console.log('Command received:', payload);
          const command = payload.new as RemoteCommand;
          
          // Dispatch command as custom event
          window.dispatchEvent(new CustomEvent(`remote-command-${command.command_type}`, {
            detail: command.command_data
          }));

          // Mark command as executed
          await supabase
            .from('remote_commands')
            .update({ executed: true })
            .eq('id', command.id);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up command listener');
      commandChannel.unsubscribe();
    };
  }, [state.deviceCode, state.isPresentation]);

  // Update device last seen timestamp
  const updateLastSeen = useCallback(async () => {
    if (!state.deviceCode || !user) return;

    await supabase
      .from('remote_devices')
      .update({ last_seen: new Date().toISOString() })
      .eq('device_code', state.deviceCode)
      .eq('user_id', user.id);
  }, [state.deviceCode, user]);

  // Set up heartbeat for presentation devices
  useEffect(() => {
    if (!state.isPresentation || !state.deviceCode) return;

    const interval = setInterval(updateLastSeen, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [state.isPresentation, state.deviceCode, updateLastSeen]);

  // Cleanup device when component unmounts
  const cleanup = useCallback(async () => {
    if (state.deviceCode && user) {
      await supabase
        .from('remote_devices')
        .update({ is_active: false })
        .eq('device_code', state.deviceCode)
        .eq('user_id', user.id);
    }
  }, [state.deviceCode, user]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    generateDeviceCode,
    connectToDevice,
    sendCommand,
    cleanup
  };
};
