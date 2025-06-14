
import SupabaseGroupSession from "@/components/session/SupabaseGroupSession";

const GroupSessionPage = () => {
  return (
    <SupabaseGroupSession 
      onBack={() => window.history.back()}
      onSessionStart={(sessionData) => {
        // Redirect to presentation mode with session data
        window.location.href = '/presentation';
      }}
    />
  );
};

export default GroupSessionPage;
