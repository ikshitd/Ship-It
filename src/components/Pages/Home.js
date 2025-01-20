import { Layout, Menu, Divider, List, Avatar, Modal, Input } from 'antd';
import { useAppContext } from '../../context/Context.js';
import { useState, useEffect } from 'react';
import Board from '../Board/Board.js';
import { Link } from 'react-router-dom';
import { ReactComponent as ShareIcon } from '../../assets/svg/shareIcon.svg';
import { PlusOutlined } from '@ant-design/icons';
import socket from '../../socket/socket.js';

export default function Home() {
  const { boards, userId, addBoard } = useAppContext();
  const { Sider, Content } = Layout;
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleModalOk = async () => {
    if (newBoardName.trim()) {
      try {
        setIsLoading(true);
        const newBoard = await addBoard(newBoardName.trim());
        setNewBoardName('');
        setIsModalVisible(false);
        socket.emit('boardAdded', {
          boardId: newBoard.id,
          userId: userId,
          board: newBoard,
        });
      } catch (err) {
        console.error('Failed to create board', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleModalCancel = () => {
    setNewBoardName('');
    setIsModalVisible(false);
  };

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
    <Layout style={{ position: 'static', minHeight: '100vh' }}>
      <Sider
        width={'15%'}
        style={{
          background: '#f9f9f9',
          borderRight: '1px solid #d9d9d9',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ display: 'inline', fontWeight: 'bold', margin: '10px' }}> Boards </h3>
            <PlusOutlined
              onClick={() => {
                setIsModalVisible(true);
              }}
              style={{
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '3px',
              }}
            />
          </div>
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
        <Divider style={{ margin: '11px 0' }} />
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
      <Modal
        title="Add New Board"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okButtonProps={{ disabled: !newBoardName.trim() || isLoading }}
        confirmLoading={isLoading}
      >
        <Input
          placeholder="Enter board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onPressEnter={() => {
            if (newBoardName.trim() && !isLoading) handleModalOk();
          }}
        />
      </Modal>
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
