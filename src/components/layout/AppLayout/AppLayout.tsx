import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AppHeader } from '../AppHeader';
import { Sidebar } from '../Sidebar';
import './AppLayout.css';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/campaigns': 'Campaigns',
  '/campaigns/new': 'Create Campaign',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/campaigns/')) return 'Campaign Details';
  return 'Portal';
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    // On mobile, toggle drawer. On desktop, toggle collapse.
    if (window.innerWidth <= 768) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  // Close mobile sidebar when route changes
  const currentPath = location.pathname;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    closeMobile();
  }, [currentPath, closeMobile]);

  // Close mobile sidebar with Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMobileOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className={`app-layout ${isCollapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onClose={closeMobile}
      />
      <div className="app-layout__body">
        <AppHeader pageTitle={pageTitle} onMenuToggle={toggleMenu} />
        <main className="app-layout__main" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
