import { Layout, Menu, Divider, List, Avatar } from 'antd';
import { useAppContext } from '../../context/Context.js';
import { useState, useEffect } from 'react';
import Board from '../Board/Board.js';
import { Link } from 'react-router-dom';

export default function Home() {
  const { boards, userId } = useAppContext();
  const { Sider, Content } = Layout;
  const [currentBoardId, setCurrentBoardId] = useState(null);

  useEffect(() => {
    if (boards.length > 0) {
      setCurrentBoardId(boards[0]?.id);
    }
  }, [boards]);

  const handleMenuClick = ({ key }) => {
    setCurrentBoardId(parseInt(key, 10));
  };

  const selectedBoard = boards.find((board) => board.id === currentBoardId);
  const users = [];

  const menuItems = boards.map((board) => ({
    key: board.id.toString(),
    label: board.name,
    onClick: () => handleMenuClick({ key: board.id.toString() }),
  }));

  if (!userId) {
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
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Please Log In or Sign Up</h3>
          <p style={{ color: '#888' }}>
            You need to sign in to view your boards. Click below to either log in or register.
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/login">
              <button
                style={{
                  padding: '10px 20px',
                  margin: '5px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Log In
              </button>
            </Link>
            <Link to="/register">
              <button
                style={{
                  padding: '10px 20px',
                  margin: '5px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={'15%'}
        style={{
          background: '#f9f9f9',
          borderRight: '1px solid #d9d9d9',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Boards</h3>
          {boards.length > 0 ? (
            <Menu
              mode="vertical"
              className="custom-menu"
              defaultSelectedKeys={[boards[0]?.id.toString()]}
              items={menuItems}
              style={{
                background: '#f9f9f9',
                border: 0,
                fontSize: '16px',
                fontWeight: '400',
                margin: '0px',
              }}
            />
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>No boards available.</p>
          )}
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Users</h3>
          {users.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={users}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#87d068' }} size="large">
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={user.name}
                    description={user.email}
                  />
                </List.Item>
              )}
            />
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>No users attached to this board.</p>
          )}
        </div>
      </Sider>
      <Layout>
        <Content style={{ background: '#fff', borderRadius: '8px' }}>
          {selectedBoard ? (
            <Board board={selectedBoard} />
          ) : (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#888' }}>
              No board selected. Please select a board from the sidebar.
            </p>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
