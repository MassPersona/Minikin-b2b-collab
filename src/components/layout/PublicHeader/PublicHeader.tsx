import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../common/Button';
import LogoSvg from '../../../assets/white.png';
import './PublicHeader.css';

export function PublicHeader() {
  const navigate = useNavigate();

  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Link to="/" className="public-header__logo" aria-label="Minikin home">
          <img src={LogoSvg} alt="Minikin" style={{ height: 100, width: 'auto' , paddingTop: 10}} />
        </Link>
        <nav className="public-header__nav" aria-label="Main navigation">
          <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
}
