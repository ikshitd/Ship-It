import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ReactComponent as SessionExpiredSVG } from '../../assets/svg/sessionExpired.svg';

export default function SessionExpired() {
  const { Title, Paragraph } = Typography;
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
      <div style={{ marginBottom: '30px' }}>
        <SessionExpiredSVG fill="#ffffff" width="300px" height="300px" />
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
        <Title level={3} style={{ fontWeight: 'bold', marginBottom: '12px' }}>
          Session Expired
        </Title>
        <Paragraph style={{ color: '#888', marginBottom: '20px' }}>
          Your session has timed out due to inactivity. Please log in again to continue.
        </Paragraph>
        <Link to="/login">
          <Button type="primary" size="large">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
