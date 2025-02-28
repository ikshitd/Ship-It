import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../../assets/svg/visibilityIcon.svg';
import axios from 'axios';
import { ReactComponent as ShareIcon } from '../../assets/svg/shareIcon.svg';
import { GoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../redux/slices/authSlice.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const defaultFormValues = {
    email: '',
    password: '',
  };
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues);
  const { email, password } = formData;
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isLoading, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) {
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // need to find some way to fix this small issue //
      }, 0);
    }
    setFormData(defaultFormValues);
    dispatch(reset());
  }, [user, isError, isLoading, isSuccess, message, navigate, dispatch]);

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  }

  return (
    <>
      <ToastContainer />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: '#f9f9f9',
          padding: '20px',
        }}
      >
        <div style={{ marginBottom: '30px' }}>
          <ShareIcon fill="#FFC107" width="100px" height="100px" />
        </div>
        <div
          style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center',
          }}
        >
          <header>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              Welcome Back!
            </p>
          </header>

          <form onSubmit={onSubmit}>
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              required
              id="email"
              value={email}
              onChange={onChange}
              style={{
                fontSize: '20px',
                width: '100%',
                paddingLeft: '50px',
                marginBottom: '15px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            />
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="passwordInput"
                placeholder="Password"
                required
                id="password"
                value={password}
                onChange={onChange}
                style={{
                  fontSize: '20px',
                  width: '100%',
                  paddingLeft: '50px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              />
              <img
                src={visibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword((prevState) => !prevState)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              />
            </div>
            <div
              style={{
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <ArrowRightIcon fill="#ffffff" width="24px" height="24px" />
              </button>
              {/* WORK IN PROGRESS... */}
              <GoogleLogin
                onSuccess={async (response) => {
                  const userAccessToken = response.credential;
                  const apiResponse = await axios.get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userAccessToken}`,
                    {
                      headers: {
                        Authorization: `Bearer ${userAccessToken}`,
                        Accept: 'application/json',
                      },
                    }
                  );
                  console.log(apiResponse.data);
                }}
                onError={(response) => {
                  console.log('ERROR RESPONSE: ', response);
                }}
              />
            </div>
          </form>
          {error && (
            <p
              style={{
                color: 'red',
                fontSize: '14px',
                marginTop: '10px',
              }}
            >
              {error}
            </p>
          )}
          <Link to="/register">
            <p
              style={{
                color: '#007bff',
                marginTop: '20px',
                fontSize: '16px',
              }}
            >
              Register Instead
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
