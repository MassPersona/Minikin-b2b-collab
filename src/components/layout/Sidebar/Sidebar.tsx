import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// Inline SVG icon for Campaigns
function CampaignsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isCollapsed, isMobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${isMobileOpen ? 'sidebar--mobile-open' : ''}`}
        aria-label="Application navigation"
      >
        <div className="sidebar__logo">
          <span className="logo-mark">M</span>
          {!isCollapsed && <span className="logo-text">Minikin</span>}
        </div>

        <nav className="sidebar__nav">
          <p className={`sidebar__section-label ${isCollapsed ? 'sr-only' : ''}`}>
            Navigation
          </p>
          <NavLink
            to="/campaigns"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            title="Campaigns"
            onClick={() => { if (isMobileOpen) onClose(); }}
          >
            <span className="sidebar__link-icon"><CampaignsIcon /></span>
            {!isCollapsed && <span className="sidebar__link-label">Campaigns</span>}
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
