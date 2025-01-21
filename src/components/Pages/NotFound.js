import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFound() {
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
        <img src="/images/notFound.jpg" height="250px" width="250px" />
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
          Oops! Page Not Found
        </Title>
        <Paragraph style={{ color: '#888', marginBottom: '20px' }}>
          The page you are looking for does not exist or has been moved. Use the button below to go back to
          the home page.
        </Paragraph>
        <Link to="/">
          <Button type="primary" size="large">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
