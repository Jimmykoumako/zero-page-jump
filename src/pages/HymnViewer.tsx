
import SupabasePresentationMode from "@/components/presentation/SupabasePresentationMode";

const HymnViewerPage = () => {
  return (
    <SupabasePresentationMode onBack={() => window.history.back()} />
  );
};

export default HymnViewerPage;
