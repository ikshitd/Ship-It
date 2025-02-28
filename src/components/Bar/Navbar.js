import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as LogoutIcon } from '../../assets/svg/logoutIcon.svg';
import { ReactComponent as PersonOutLineIcon } from '../../assets/svg/personOutlineIcon.svg';
import { ReactComponent as OrbitIcon } from '../../assets/svg/orbit.svg';
import { Tooltip } from 'antd';
import { useAppContext } from '../../context/Context.js';

export default function Footer() {
  const { userId } = useAppContext();
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
            <p>
              {' '}
              <OrbitIcon
                style={{ position: 'absolute', left: '2%', bottom: '6%' }}
                height="40px"
                width="40px"
                fill="white"
              />
            </p>
            <p
              style={{
                color: 'white',
                fontSize: '110%',
                fontFamily: 'Concert One',
                letterSpacing: '0.1em',
                position: 'absolute',
                left: '6%',
                bottom: '%',
                top: '15%',
              }}
              className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}
            >
              {' '}
              <span style={{ fontSize: '120%' }}> Ship'It' </span> KEEPING DEV IN MOTION{' '}
            </p>
          </li>
          <li
            style={{ position: 'absolute', right: '0%', bottom: '20%' }}
            className="navbarListItem"
            onClick={() => navigate('/')}
          >
            <Tooltip title="Logout" placement="bottom">
              <LogoutIcon
                onClick={() => {
                  setTimeout(() => {
                    sessionStorage.clear();
                    window.location.reload();
                  }, 0);
                }}
                fill="white"
                width="10%"
                height="10%"
              />
            </Tooltip>
          </li>
          <li
            style={{ position: 'absolute', right: '9%', bottom: '20%' }}
            className="navbarListItem"
            onClick={() => navigate('/')}
          >
            <Tooltip
              title={!userId ? 'No User Logged In! Register or Sign in to the user profile.' : 'Profile'}
              placement="bottom"
            >
              <PersonOutLineIcon
                onClick={() => {
                  setTimeout(() => {
                    sessionStorage.clear();
                    if (userId) {
                      navigate('/profile');
                      window.location.reload();
                    }
                  }, 0);
                }}
                fill="white"
                width="10%"
                height="10%"
              />
            </Tooltip>
          </li>
        </ul>
      </nav>
    </header>
  );
}
