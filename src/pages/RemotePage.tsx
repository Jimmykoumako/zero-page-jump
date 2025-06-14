
import SupabaseRemoteControl from "@/components/remote/SupabaseRemoteControl";

const RemotePage = () => {
  return (
    <SupabaseRemoteControl onBack={() => window.history.back()} />
  );
};

export default RemotePage;
