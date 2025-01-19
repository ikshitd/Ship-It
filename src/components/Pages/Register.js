import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../../assets/svg/visibilityIcon.svg';
import axios from 'axios';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/register', {
        name: name,
        email: email,
        password: password,
      });
      if (response.status === 200) {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Registration failed');
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
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
            Create Your Account!
          </p>
        </header>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="User Name"
            id="name"
            value={name}
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
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
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
          <div
            style={{
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            <input
              type={showPassword ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
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
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <ArrowRightIcon fill="#ffffff" width="24px" height="24px" />
            </button>
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
        <Link to="/login">
          <p
            style={{
              color: '#007bff',
              marginTop: '20px',
              fontSize: '16px',
            }}
          >
            Log In Instead
          </p>
        </Link>
      </div>
    </div>
  );
}
