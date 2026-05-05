import { useEffect, useMemo } from 'react';
import { Outlet, useMatches } from 'react-router-dom';
import { getCurrentRouteTitle } from './routeTitles';

export const DocumentTitle = () => {
  const matches = useMatches();
  const title = useMemo(() => getCurrentRouteTitle(matches, 'Login'), [matches]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return <Outlet />;
};
