import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import visibilityIcon from '../../assets/svg/visibilityIcon.svg';
import { Layout, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../../redux/slices/authSlice.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const defaultFormValues = {
    name: '',
    email: '',
    password: '',
  };
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues);
  const { name, email, password } = formData;
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess || user) {
      navigate('/login');
    }
    setFormData(defaultFormValues);
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const userData = {
      name,
      email,
      password,
    };
    dispatch(register(userData));
  };

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
              Create Your Account !
            </p>
          </header>
          <form onSubmit={onSubmit}>
            <Input
              type="text"
              placeholder="User Name"
              required
              id="name"
              value={name}
              onChange={onChange}
              style={{
                height: '55px',
                fontSize: '16px',
                width: '100%',
                paddingLeft: '50px',
                marginBottom: '15px',
                borderRadius: '0px',
                border: '1px solid black',
              }}
            />
            <Input
              type="email"
              placeholder="Email"
              required
              id="email"
              value={email}
              onChange={onChange}
              style={{
                height: '55px',
                fontSize: '16px',
                width: '100%',
                paddingLeft: '50px',
                marginBottom: '15px',
                borderRadius: '0px',
                border: '1px solid black',
              }}
            />
            <div
              style={{
                position: 'relative',
                marginBottom: '20px',
              }}
            >
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                id="password"
                value={password}
                onChange={onChange}
                style={{
                  height: '55px',
                  fontSize: '16px',
                  width: '100%',
                  paddingLeft: '50px',
                  borderRadius: '0px',
                  border: '1px solid black',
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
                type="primary"
                style={{
                  width: '100%',
                  padding: '10px 20px',
                  backgroundColor: '#10a37e',
                  color: 'white',
                  // border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {/* <ArrowRightIcon fill="#ffffff" width="24px" height="24px" /> */}
                Register
              </button>
            </div>
          </form>
          <p>
            Already have an account?{' '}
            <span>
              <Link to="/login" style={{ display: 'inline' }}>
                <span
                  style={{
                    color: '#007bff',
                    marginTop: '20px',
                    fontSize: '16px',
                  }}
                >
                  Login Instead
                </span>
              </Link>
            </span>
          </p>
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
