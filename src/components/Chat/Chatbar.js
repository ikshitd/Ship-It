import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import Sider from 'antd/es/layout/Sider.js';

export default function Chatbar() {
  const { user } = useSelector((state) => state.auth);
  const { TabPane } = Tabs;
  const [askInput, setAskInput] = useState('');
  const [chats, setChats] = useState([
    {
      id: 1,
      query: 'what do you mean by a game ? ',
      response: 'game is some kind of an activity that we play around with for joyfulness.',
    },
    {
      id: 2,
      query: 'what do you mean by a game ? ',
      response: 'game is some kind of an activity that we play around with for joyfulness.',
    },
    {
      id: 3,
      query: 'what do you mean by a game ? ',
      response: 'game is some kind of an activity that we play around with for joyfulness.',
    },
    {
      id: 3,
      query: 'what do you mean by a game ? ',
      response: 'game is some kind of an activity that we play around with for joyfulness.',
    },
    {
      id: 3,
      query: 'what do you mean by a game ? ',
      response: 'game is some kind of an activity that we play around with for joyfulness.',
    },
    {
      id: 3,
      query: 'what do you mean by a game ? ',
      response: 'game is some kind of an activity that we play around with for joyfulness.',
    },
    {
      id: 3,
      query: 'what do you mean by a game ? ',
      response: 'game is some kind of an activity that we play around with for joyfulness.',
    },
  ]);

  return (
    <Sider
      // width="40%"
      width="35%"
      theme="light"
      style={{
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderWidth: '0.5px',
        borderColor: '#ccc9c8',
        borderTop: 'none',
      }}
    >
      <Tabs
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <TabPane tab="Auto-Generated Content" key="2">
          <h1> how are you today </h1>
        </TabPane>
        <TabPane tab="Chatbox" key="1">
          <h3 sytle={{ color: '#ccc9c8' }}> Ask anything !! </h3>
          <div
            style={{
              margin: '3%',
              overflowY: 'scroll',
              height: '100vh',
              maxHeight: '70vh',
              scrollBehavior: 'smooth',
            }}
          >
            {chats.map((chat) => (
              <>
                <p style={{ fontSize: '16px', marginBottom: '-10px' }}>
                  {' '}
                  <strong style={{ color: 'rgb(215, 162, 204)' }}> {user ? user.name : 'rufus'}: </strong>
                  {chat.query}{' '}
                </p>
                <p style={{ fontSize: '16px' }}>
                  {' '}
                  <strong> gr: </strong> {chat.response}{' '}
                </p>
              </>
            ))}
          </div>
          <input
            placeholder="[Enter] to ask"
            value={askInput}
            onChange={(e) => {
              setAskInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setAskInput('');
              }
            }}
            style={{
              position: 'relative',
              fontSize: '15px',
              height: '30px',
              width: '80%',
              marginLeft: '10%',
            }}
          />
        </TabPane>
      </Tabs>
    </Sider>
  );
}
