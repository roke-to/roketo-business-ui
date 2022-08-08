import React from 'react';
import {useLocation} from 'react-router-dom';

export function useQuery() {
  const {search} = useLocation();

  return React.useMemo(() => {
    const urlSearchParams = new URLSearchParams(search);

    return Array.from(urlSearchParams.entries()).reduce((acc, [key, value]) => {
      // call one more decodeURIComponent, because near often
      // encode url twice while redicrecting back
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);
  }, [search]);
}
