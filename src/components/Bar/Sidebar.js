import { Layout, Menu, Divider, List, Avatar } from 'antd';
import { useAppContext } from '../../context/Context';
import { useState } from 'react';
import Board from '../Board/Board';

export default function Sidebar() {
  const { boards } = useAppContext();
  const { Sider, Content } = Layout;
  const [currentBoardId, setCurrentBoardId] = useState(boards[0]?.id);

  const handleMenuClick = (boardId) => {
    setCurrentBoardId(boardId);
  };

  const selectedBoard = boards.find((board) => board.id === currentBoardId);
  const users = [];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={300}
        theme="light"
        style={{
          background: '#f0f2f5',
          borderRight: '1px solid #d9d9d9',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}> Boards </h3>
          <Menu
            mode="inline"
            defaultSelectedKeys={[boards[0]?.id]}
            style={{
              border: 0,
              fontSize: '16px',
              fontWeight: '500',
              margin: '0px',
              borderRadius: '10px',
            }}
          >
            {boards.map((board) => (
              <Menu.Item
                key={board.id}
                onClick={() => handleMenuClick(board.id)}
                style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '10px 24px',
                }}
              >
                {board.name}
              </Menu.Item>
            ))}
          </Menu>
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
