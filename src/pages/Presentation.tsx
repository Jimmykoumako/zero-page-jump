
import SupabasePresentationMode from "@/components/presentation/SupabasePresentationMode";

const PresentationPage = () => {
  return (
    <SupabasePresentationMode onBack={() => window.history.back()} />
  );
};

export default PresentationPage;
