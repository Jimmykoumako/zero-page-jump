
import { useState } from "react";
import SupabasePresentationMode from "@/components/presentation/SupabasePresentationMode";

const PresentationPage = () => {
  return (
    <div className="min-h-screen">
      <SupabasePresentationMode onBack={() => window.history.back()} />
    </div>
  );
};

export default PresentationPage;
