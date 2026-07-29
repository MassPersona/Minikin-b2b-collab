import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button';
import './PublicHeader.css';

export function PublicHeader() {
  const navigate = useNavigate();

  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Link to="/" className="public-header__logo" aria-label="Minikin home">
          <span className="logo-mark">M</span>
          <span className="logo-text">Minikin</span>
        </Link>
        <nav className="public-header__nav" aria-label="Main navigation">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
}
