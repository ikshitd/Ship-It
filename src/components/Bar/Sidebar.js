import { useState } from 'react';
import { Layout, Menu, Modal, Input, Divider, List, Avatar, Typography } from 'antd';
import { PlusOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons';
import socket from '../../socket/socket.js';

export default function Sidebar({
  boards,
  currentBoardId,
  setIsModalVisible,
  users,
  newBoardName,
  handleModalOk,
  isModalVisible,
  handleModalCancel,
  setNewBoardName,
  isLoading,
  setCurrentBoardId,
}) {
  const { Sider } = Layout;
  const { Title } = Typography;

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
          border: 'solid',
          borderTop: 'none',
          borderColor: 'black',
        }}
      >
        <div>
          <div style={{ color: '' }} className="flex items-center justify-between mb-4">
            <Title style={{ color: 'black' }} level={4}>
              {'Boards'}
            </Title>
            {
              <PlusOutlined
                onClick={() => setIsModalVisible(true)}
                className="text-lg cursor-pointer hover:text-blue-600 transition-colors"
              />
            }
          </div>
        </div>

        <div
          style={{ border: 'solid', borderColor: 'black', borderRight: 'none', borderLeft: 'none' }}
          className="overflow-y-auto h-[calc(100vh-64px)]"
        >
          {boards.length > 0 ? (
            <Menu
              theme="jksjdkf"
              mode="inline"
              selectedKeys={[currentBoardId?.toString()]}
              items={menuItems}
              className="border-r-0"
              style={{
                color: 'black',
              }}
            />
          ) : (
            <div className="px-4 text-gray-500 text-center">No boards available.</div>
          )}

          {
            <>
              <Divider className="my-4" />
              <div className="px-4">
                <div className="flex items-center gap-2 mb-4">
                  <TeamOutlined style={{ color: 'black' }} className="text-lg" />
                  <Title style={{ color: 'black' }} level={4}>
                    Team Members
                  </Title>
                </div>
                {users.length > 0 ? (
                  <List
                    // itemLayout="horizontal"
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
    </>
  );
}
