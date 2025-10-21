import { Outlet } from 'react-router-dom';
import { Navigation } from './components';

export function AppLayout() {
  return (
    <div className="background">
      <Navigation />
      <Outlet />
    </div>
  );
}
