import React from 'react';
import { useNavigate } from 'react-router-dom';
import HymnbookBrowser from '@/components/HymnbookBrowser';
import { type Hymnbook } from '@/components/HymnbookBrowser'; // Assuming Hymnbook type is exported

const HymnbookBrowserPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectHymnbook = (hymnbook: Hymnbook) => {
    console.log('Hymnbook selected:', hymnbook);
    navigate(`/hymnbook/${hymnbook.id}`);
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mx-auto p-4">
      <HymnbookBrowser 
        onSelectHymnbook={handleSelectHymnbook} 
        onBack={handleBack} 
      />
    </div>
  );
};

export default HymnbookBrowserPage;
