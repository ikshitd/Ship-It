import { Layout, Menu, Divider, List, Avatar, Modal, Input, Typography } from 'antd';
import { useAppContext } from '../../context/Context.js';
import { useState, useEffect } from 'react';
import Board from '../Board/Board.js';
import { Link } from 'react-router-dom';
import { ReactComponent as ShareIcon } from '../../assets/svg/shareIcon.svg';
import { PlusOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons';
import socket from '../../socket/socket.js';
import axios from 'axios';

export default function Home() {
  const { boards, userId, addBoard } = useAppContext();
  const { Sider, Content } = Layout;
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const { Title } = Typography;

  useEffect(() => {
    if (boards.length > 0) {
      setCurrentBoardId(boards[0]?.id);
    }
  }, [boards]);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:3001/get-users?boardId=${currentBoardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.boardUsers.users;
    } catch (err) {
      console.error('Error fetching the users for the boards:', err);
    }
  };

  useEffect(() => {
    if (currentBoardId) {
      const getUsers = async () => {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse);
      };
      getUsers();
    }
  }, [currentBoardId]);

  const handleMenuClick = ({ key }) => {
    setCurrentBoardId(parseInt(key, 10));
    socket.emit('boardSelected', {
      boardId: parseInt(key),
    });
  };

  const selectedBoard = boards.find((board) => board.id === currentBoardId);

  const menuItems = boards.map((board) => ({
    key: board.id.toString(),
    label: board.name,
    icon: <AppstoreOutlined />,
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
        width="10%"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <Title level={4} className="!mb-0">
              {!collapsed && 'Boards'}
            </Title>
            {!collapsed && (
              <PlusOutlined
                onClick={() => setIsModalVisible(true)}
                className="text-lg cursor-pointer hover:text-blue-600 transition-colors"
              />
            )}
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {boards.length > 0 ? (
            <Menu
              mode="inline"
              selectedKeys={[currentBoardId?.toString()]}
              items={menuItems}
              className="border-r-0"
            />
          ) : (
            <div className="px-4 text-gray-500 text-center">No boards available.</div>
          )}

          {!collapsed && (
            <>
              <Divider className="my-4" />
              <div className="px-4">
                <div className="flex items-center gap-2 mb-4">
                  <TeamOutlined className="text-lg" />
                  <Title level={5} className="!mb-0">
                    Team Members
                  </Title>
                </div>
                {users.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={users}
                    renderItem={(user) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>}
                          title={user.name}
                          description={user.email}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="text-gray-500 text-center text-sm">No team members yet</div>
                )}
              </div>
            </>
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
