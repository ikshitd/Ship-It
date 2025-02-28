import { Layout, Menu, Modal, Input, Divider, List, Avatar, Typography } from 'antd';
import { PlusOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons';
import socket from '../../socket/socket.js';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

export default function Sidebar({
  boards,
  currentBoardId,
  setisAddBoardModalVisible,
  users,
  newBoardName,
  newUser,
  setNewUser,
  handleAddBoardModalOk,
  isAddBoardModalVisible,
  handleAddBoardModalCancel,
  setNewBoardName,
  isLoading,
  setCurrentBoardId,
  isAddUserModalVisible,
  setisAddUserModalVisible,
  handleAddUserModalCancel,
  handleAddUserModalOk,
}) {
  const { Sider } = Layout;

  const menuItems = boards.map((board) => ({
    key: board.id.toString(),
    label: board.name,
    icon: <AppstoreOutlined />,
    onClick: () => handleMenuClick({ key: board.id.toString() }),
  }));

  const handleMenuClick = ({ key }) => {
    setCurrentBoardId(parseInt(key, 10));
    socket.emit('boardSelected', {
      boardId: parseInt(key),
    });
  };

  return (
    <>
      <Sider
        width="13%"
        theme="light"
        style={{
          color: 'black',
          backgroundColor: '#ccdcff',
          borderTop: 'none',
          borderColor: 'black',
        }}
      >
        <div>
          <div style={{ justifyContent: 'space-between' }} className="flex items-center justify-between mb-4">
            <p
              style={{
                fontFamily: 'consolas',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold',
                marginLeft: '10%',
              }}
            >
              {'Boards'}
            </p>
            <PlusOutlined onClick={() => setisAddBoardModalVisible(true)} style={{ marginRight: '10%' }} />
          </div>
        </div>
        {boards.length > 0 ? (
          <Menu
            theme="light"
            mode="vertical"
            selectedKeys={[currentBoardId?.toString()]}
            items={menuItems}
            style={{
              backgroundColor: '#ccdcff',
            }}
          />
        ) : (
          <div className="px-4 text-gray-500 text-center">No boards available.</div>
        )}
        {
          <>
            <Divider />
            <div>
              <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                <p
                  style={{
                    fontSize: '16px',
                    fontFamily: 'consolas',
                    color: 'black',
                    fontWeight: 'bold',
                    marginLeft: '10%',
                  }}
                  level={5}
                >
                  Team Members
                </p>
                <TeamOutlined
                  onClick={() => {
                    setisAddUserModalVisible(true);
                  }}
                  style={{ color: 'black', marginRight: '10%' }}
                />
              </div>
              {users.length > 0 ? (
                <List
                  dataSource={users}
                  style={{ color: 'black' }}
                  renderItem={(user) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>}
                        title={user.name}
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div className="text-gray-500 text-center text-sm">No team members yet</div>
              )}
            </div>
          </>
        }
      </Sider>
      <Modal
        open={isAddUserModalVisible}
        onOk={handleAddUserModalOk}
        onCancel={handleAddUserModalCancel}
        title="Add new Team member on the board"
        style={{ height: '100%' }}
      >
        <ReactSearchAutocomplete
          placeholder="WORK IN PROGRESS... THIS DOESN'T WORK YET !!"
          value={newUser.userName}
          onChange={(e) => {
            setNewUser({
              ...newUser,
              userName: e.target.value,
            });
          }}
        />
      </Modal>
      <Modal
        title="Add New Board"
        open={isAddBoardModalVisible}
        onOk={handleAddBoardModalOk}
        onCancel={handleAddBoardModalCancel}
        okButtonProps={{ disabled: !newBoardName.trim() || isLoading }}
        confirmLoading={isLoading}
      >
        <Input
          placeholder="Enter board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onPressEnter={() => {
            if (newBoardName.trim() && !isLoading) handleAddBoardModalOk();
          }}
        />
      </Modal>
    </>
  );
}
