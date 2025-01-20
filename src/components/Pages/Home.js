import { Layout, Menu, Divider, List, Avatar, Input, Modal, message } from 'antd';
import { useAppContext } from '../../context/Context.js';
import { useState } from 'react';
import Board from '../Board/Board.js';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

export default function Home() {
  const { boards, userId, addBoard, handleBoardClick, selectedBoardId } = useAppContext();
  const { Sider, Content } = Layout;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuClick = ({ key }) => {
    handleBoardClick(parseInt(key, 10));
  };

  const handleAddBoard = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (newBoardName.trim()) {
      try {
        setIsLoading(true);
        console.log('Attempting to create board:', newBoardName);
        const result = await addBoard(newBoardName.trim());
        console.log('Create board result:', result);

        if (result.success) {
          message.success('Board created successfully');
          setNewBoardName('');
          setIsModalVisible(false);
        } else {
          message.error(result.error || 'Failed to create board');
        }
      } catch (error) {
        console.error('Error in handleModalOk:', error);
        message.error('Failed to create board');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleModalCancel = () => {
    setNewBoardName('');
    setIsModalVisible(false);
  };

  const selectedBoard = boards.find((board) => board.id === selectedBoardId);
  const users = [];

  const menuItems = boards.map((board) => ({
    key: board.id.toString(),
    label: board.name,
    onClick: () => handleMenuClick({ key: board.id.toString() }),
  }));

  // Rest of your component remains the same...

  return (
    <Layout style={{ position: 'static', minHeight: '100vh' }}>
      <Sider width={'15%'} style={{
          background: '#f9f9f9',
          borderRight: '1px solid #d9d9d9',
          overflowY: 'auto',
        }}>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontWeight: 'bold', margin: 0 }}>Boards</h3>
            <PlusOutlined 
              onClick={handleAddBoard}
              style={{ 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            />
          </div>
          {boards.length > 0 ? (
            <Menu
              mode="vertical"
              className="custom-menu"
              selectedKeys={[selectedBoardId?.toString()]}
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
    </Layout>
  );
}