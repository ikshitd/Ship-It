import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import visibilityIcon from '../../assets/svg/visibilityIcon.svg';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../redux/slices/authSlice.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input, Divider } from 'antd';

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
          display: 'grid',
          placeItems: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '30px',
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
            <Input
              type="email"
              placeholder="Email"
              required
              id="email"
              value={email}
              onChange={onChange}
              style={{
                fontSize: '16px',
                width: '100%',
                paddingLeft: '50px',
                marginBottom: '15px',
                height: '55px',
                border: '1px solid black',
                borderRadius: '0px',
              }}
            />
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                id="password"
                value={password}
                onChange={onChange}
                style={{
                  fontSize: '16px',
                  width: '100%',
                  paddingLeft: '50px',
                  height: '55px',
                  border: '1px solid black',
                  borderRadius: '0px',
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
              }}
            >
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Continue
              </button>
              <p>
                Don't have an account?{' '}
                <span>
                  <Link to="/register" style={{ display: 'inline' }}>
                    <span
                      style={{
                        color: '#007bff',
                        marginTop: '20px',
                        fontSize: '16px',
                      }}
                    >
                      Register Instead
                    </span>
                  </Link>
                </span>
              </p>
              {/* WORK IN PROGRESS... */}
            </div>
            <Divider variant="solid">OR</Divider>
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
        </div>
      </div>
    </>
  );
}
