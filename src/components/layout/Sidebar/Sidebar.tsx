import { NavLink } from 'react-router-dom';
import LogoSvg from '../../../assets/white.png';
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

// Inline SVG icon for Dashboard
function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
        aria-label="Application navigation"
      >

        <nav className="sidebar__nav">
          <p className="sidebar__section-label">
            Navigation
          </p>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            title="Dashboard"
            onClick={onClose}
          >
            <span className="sidebar__link-icon"><DashboardIcon /></span>
            <span className="sidebar__link-label">Dashboard</span>
          </NavLink>
          <NavLink
            to="/campaigns"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            title="Campaigns"
            onClick={onClose}
          >
            <span className="sidebar__link-icon"><CampaignsIcon /></span>
            <span className="sidebar__link-label">Campaigns</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
