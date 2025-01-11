import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      style={{
        margin: '20px',
      }}
    >
      <h1 style={{ margin: '8px' }}> Login </h1>
      <Input
        value={email}
        type="email"
        placeholder="xyz@abc.com"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        style={{ margin: '8px' }}
      ></Input>
      <Input
        value={password}
        type="password"
        placeholder="****"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        style={{ margin: '8px' }}
      ></Input>
      <Button
        className="btn btn-neutral btn-primary"
        onClick={() => {
          // TODO: set Item to localStorage
        }}
        type="primary"
        style={{ margin: '8px' }}
      >
        submit{' '}
      </Button>
      <Link to="/">
        <Button type="default"> Go back to Home </Button>
      </Link>
    </div>
  );
}
export default Login;
