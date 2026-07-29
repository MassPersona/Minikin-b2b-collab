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
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);
  const location = useLocation();

  const toggleMenu = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  // Close sidebar on mobile when route changes
  const currentPath = location.pathname;
  useEffect(() => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }, [currentPath, closeSidebar]);

  // Close sidebar with Escape key on mobile
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className={`app-layout ${isSidebarOpen ? 'app-layout--sidebar-open' : ''}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
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
