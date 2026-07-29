import { useAuth } from '../../../context/AuthContext';
import './AppHeader.css';

// Hamburger icon
function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// Logout icon
function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
    </svg>
  );
}

interface AppHeaderProps {
  pageTitle: string;
  onMenuToggle: () => void;
}

export function AppHeader({ pageTitle, onMenuToggle }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <button
        className="app-header__menu-btn"
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        type="button"
      >
        <HamburgerIcon />
      </button>

      <h1 className="app-header__title">{pageTitle}</h1>

      <div className="app-header__right">
        {user && (
          <span className="app-header__org" aria-label={`Signed in as ${user.name}`}>
            {user.organization}
          </span>
        )}
        <button
          className="app-header__logout"
          onClick={logout}
          aria-label="Log out"
          type="button"
          title="Log out"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
