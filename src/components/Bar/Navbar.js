import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as ExploreIcon } from '../../assets/svg/exploreIcon.svg';
import { ReactComponent as LogoutIcon } from '../../assets/svg/logoutIcon.svg';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <header className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate('/')}>
            <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width="36px" height="36px" />
            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Home</p>
          </li>
          <li className="navbarListItem" onClick={() => navigate('/')}>
            <LogoutIcon
              onClick={() => {
                setTimeout(() => {
                  localStorage.clear();
                  window.location.reload();
                }, 0);
              }}
              fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
              width="36px"
              height="36px"
            />
            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Logout</p>
          </li>
        </ul>
      </nav>
    </header>
  );
}
