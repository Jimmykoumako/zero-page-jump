
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  bucketName: string;
  acceptedFileTypes: string;
  maxFileSizeMB?: number;
  onUploadComplete: (url: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
  label: string;
  currentFileUrl?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  bucketName,
  acceptedFileTypes,
  maxFileSizeMB = 10,
  onUploadComplete,
  onUploadError,
  label,
  currentFileUrl,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      const error = `File size must be less than ${maxFileSizeMB}MB`;
      onUploadError?.(error);
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setProgress(100);
      onUploadComplete(fileName, file.name);
      
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully.`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload file';
      onUploadError?.(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeCurrentFile = () => {
    onUploadComplete('', '');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      {currentFileUrl && !uploading && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          {acceptedFileTypes.includes('image') ? (
            <ImageIcon className="w-4 h-4" />
          ) : (
            <File className="w-4 h-4" />
          )}
          <span className="text-sm flex-1 truncate">Current file uploaded</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeCurrentFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleInputChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Max file size: {maxFileSizeMB}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
