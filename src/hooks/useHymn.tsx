
import { useState, useEffect } from 'react';

export const useHymn = () => {
  const [isLoading, setIsLoading] = useState(false);

  return { isLoading };
};
