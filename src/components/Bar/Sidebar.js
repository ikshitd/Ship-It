import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Modal, Input, Divider, List, Avatar } from 'antd';
import { PlusOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import socket from '../../socket/socket.js';
import { setCurrentBoardId, fetchUsers, addBoard, setSelectedBoard } from '../../redux/slices/boardSlice.js';

export default function Sidebar() {
  const { Sider } = Layout;
  const { boards, users, currentBoardId } = useSelector((state) => state.board);
  const [newUser, setNewUser] = useState(''); // right now, [newUser = username], but will decide if it has to be {userId, userName}
  const [newBoardName, setNewBoardName] = useState('');
  const [isAddBoardModalVisible, setisAddBoardModalVisible] = useState(false);
  const [isAddUserModalVisible, setisAddUserModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentBoardId) dispatch(fetchUsers(currentBoardId));
  }, [currentBoardId, dispatch]);

  const menuItems = boards.map((board) => ({
    key: board.id.toString(),
    label: board.name,
    icon: <AppstoreOutlined />,
    className: 'custom-menu-item',
    onClick: () => handleMenuClick({ key: board.id.toString(), board: board }),
  }));

  const handleMenuClick = ({ key, board }) => {
    dispatch(setCurrentBoardId(parseInt(key, 10)));
    dispatch(setSelectedBoard(board));
    socket.emit('boardSelected', {
      boardId: parseInt(key),
    });
  };

  const handleAddBoardModalOk = () => {
    try {
      dispatch(addBoard(newBoardName)).unwrap();
    } catch (err) {
      console.log(`Failed to create board: `, err);
    } finally {
      setNewBoardName('');
      setisAddBoardModalVisible(false);
    }
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
            <h1
              style={{
                color: 'black',
                fontWeight: 'bold',
                marginLeft: '10%',
              }}
            >
              {'Boards'}
            </h1>
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
              fontSize: '13px',
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
                <h1
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    marginLeft: '10%',
                  }}
                >
                  Team Members
                </h1>
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
                  renderItem={(user) => (
                    <List.Item>
                      <List.Item.Meta
                        style={{ height: '15px', marginLeft: '10%' }}
                        avatar={
                          <Avatar style={{ height: '20px', width: '20px' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        }
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
        // onOk={handleAddUserModalOk} // will do, while completing the `addUser` functionality
        onCancel={() => {
          setNewUser('');
          setisAddUserModalVisible(false);
        }}
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
        onCancel={() => {
          setNewBoardName('');
          setisAddBoardModalVisible(false);
        }}
        okButtonProps={{ disabled: !newBoardName.trim() }}
        // confirmLoading={isLoading}
      >
        <Input
          placeholder="Enter board name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          onPressEnter={() => {
            if (newBoardName.trim()) handleAddBoardModalOk();
          }}
        />
      </Modal>
    </>
  );
}
