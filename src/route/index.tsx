import { useRoutes } from 'react-router-dom';
import MainRoutes from './main-route';

export default function Routes() {
  const routes = [MainRoutes];
  return useRoutes(routes);
}
