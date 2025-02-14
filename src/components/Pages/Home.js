import { Layout } from 'antd';
import { useAppContext } from '../../context/Context.js';
import { useState, useEffect } from 'react';
import Board from '../Board/Board.js';
import { Link } from 'react-router-dom';
import { ReactComponent as ShareIcon } from '../../assets/svg/shareIcon.svg';
import socket from '../../socket/socket.js';
import axios from 'axios';
import Sidebar from '../Bar/Sidebar.js';

export default function Home() {
  const { boards, userId, addBoard } = useAppContext();
  const { Content } = Layout;
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

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

  const selectedBoard = boards.find((board) => board.id === currentBoardId);

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
            // padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontWeight: 'bold' }}>Please Log In or Sign Up</h3>
          <p style={{ color: '#888' }}>
            You need to sign in to view your boards. Click below to either log in or register.
          </p>
          <div>
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
    <Layout style={{ backgroundColor: '#4064ce', position: 'static', minHeight: '100vh' }}>
      <Sidebar
        boards={boards}
        currentBoardId={currentBoardId}
        setIsModalVisible={setIsModalVisible}
        users={users}
        newBoardName={newBoardName}
        handleModalOk={handleModalOk}
        isModalVisible={isModalVisible}
        handleModalCancel={handleModalCancel}
        setNewBoardName={setNewBoardName}
        isLoading={isLoading}
        setCurrentBoardId={setCurrentBoardId}
      />
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
