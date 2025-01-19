import { Layout, Menu, Divider, List, Avatar, Button, Modal, Input } from 'antd';
import { useAppContext } from '../../context/Context.js';
import { useState, useEffect } from 'react';
import Board from '../Board/Board.js';

export default function Home() {
  const { boards, addBoard } = useAppContext(); // Assuming addBoard is available in the context
  const { Sider, Content } = Layout;
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  useEffect(() => {
    if (boards.length > 0) {
      setCurrentBoardId(boards[0]?.id);
    }
  }, [boards]);

  const handleMenuClick = ({ key }) => {
    setCurrentBoardId(parseInt(key, 10));
  };

  const handleAddBoard = () => {
    if (newBoardName.trim()) {
      addBoard(newBoardName); // Function to add the new board
      setNewBoardName('');
      setIsModalVisible(false);
    }
  };

  const selectedBoard = boards.find((board) => board.id === currentBoardId);
  const users = [];

  const menuItems = boards.map((board) => ({
    key: board.id.toString(),
    label: board.name,
    onClick: () => handleMenuClick({ key: board.id.toString() }),
  }));

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
          <Button
            type="primary"
            style={{ marginTop: '16px', width: '100%' }}
            onClick={() => setIsModalVisible(true)}
          >
            Add Board
          </Button>
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

      {/* Modal for adding a new board */}
      <Modal
        title="Add New Board"
        visible={isModalVisible}
        onOk={handleAddBoard}
        onCancel={() => setIsModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
        />
      </Modal>
    </Layout>
  );
}
