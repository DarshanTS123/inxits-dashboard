export const DEFAULT_ROUTE_TITLE = 'Dashboard';

const resolveRouteTitle = (match) => {
  const routeTitle = match.handle?.title;

  return typeof routeTitle === 'function' ? routeTitle(match) : routeTitle;
};

export const getCurrentRouteTitle = (matches, fallback = DEFAULT_ROUTE_TITLE) => {
  return [...matches].reverse().map(resolveRouteTitle).find(Boolean) || fallback;
};
