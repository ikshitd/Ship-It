import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as LogoutIcon } from '../../assets/svg/logoutIcon.svg';
import { ReactComponent as PersonOutLineIcon } from '../../assets/svg/personOutlineIcon.svg';
import { ReactComponent as OrbitIcon } from '../../assets/svg/orbit.svg';
import { Flex, Tooltip } from 'antd';
import { logout, reset } from '../../redux/slices/authSlice.js';
import { ToastContainer, toast } from 'react-toastify';

export default function Navbar() {
  const { userId } = useSelector((state) => state.board);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const pathMatchRoute = (route) => route === location.pathname;

  return (
    <div className="navbar">
      <ToastContainer />
      <Flex justify="space-between" align="center" style={{ width: '90%', margin: '0 auto' }}>
        <Flex
          align="center"
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <OrbitIcon height="40px" width="40px" fill="white" style={{ marginRight: '10px' }} />
          <p
            className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}
            style={{
              top: '7px',
              color: 'white',
              fontSize: '110%',
              fontFamily: 'Concert One',
              letterSpacing: '0.1em',
              position: 'relative',
            }}
          >
            <span style={{ fontSize: '120%' }}>Ship'It'</span> KEEPING DEV IN MOTION
          </p>
        </Flex>

        <Flex align="center" gap={20} style={{ position: 'relative' }}>
          <Tooltip
            title={!userId ? 'No User Logged In! Register or Sign in to the user profile.' : 'Profile'}
            placement="bottom"
          >
            <div style={{ cursor: 'pointer', position: 'relative' }}>
              <PersonOutLineIcon
                onClick={() => {
                  setTimeout(() => {
                    if (userId) {
                      navigate('/profile');
                    } else {
                      toast.error('Login to view your profile');
                    }
                  }, 0);
                }}
                fill="white"
                width="30px"
                height="30px"
              />
            </div>
          </Tooltip>

          <Tooltip title="Logout" placement="bottom">
            <div style={{ cursor: 'pointer', position: 'relative' }}>
              <LogoutIcon
                fill="white"
                width="30px"
                height="30px"
                onClick={() => {
                  if (userId) {
                    dispatch(logout());
                    dispatch(reset());
                    // NEED TO FIGURE THIS OUT
                    window.location.reload();
                  }
                }}
              />
            </div>
          </Tooltip>
        </Flex>
      </Flex>
    </div>
  );
}
