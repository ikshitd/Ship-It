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
  let navigate = useNavigate();

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
    <div className="authenticationPage">
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Create Your Account !</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="UserName"
            id="name"
            value={name}
            onChange={onChange}
            style={{ fontSize: '20px' }}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
            style={{ fontSize: '20px' }}
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
              style={{ fontSize: '20px' }}
            />

            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
          {error && <p className="errorText">{error}</p>}
        </form>

        <Link to="/login" className="registerLink">
          Log In Instead
        </Link>
      </div>
    </div>
  );
}
