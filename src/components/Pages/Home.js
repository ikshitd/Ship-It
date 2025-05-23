import { Layout } from 'antd';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoards } from '../../redux/slices/boardSlice.js';
import { fetchUserDetails } from '../../redux/slices/authSlice.js';
import { fetchProjectCanvases } from '../../redux/slices/canvasSlice.js';
import Sidebar from '../Bar/Sidebar.js';
import Board from '../Board/Board.js';
import LoginPrompt from '../LoginPrompt.js';
import ProjectCanvas from '../Project/ProjectCanvas.js';

export default function Home() {
  const { userId, selectedBoard } = useSelector((state) => state.board);

  const { Content } = Layout;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBoards());
    dispatch(fetchUserDetails(userId));
    dispatch(fetchProjectCanvases(userId));
  }, [userId]);

  if (!userId) {
    return <LoginPrompt />;
  }

  return (
    <Layout style={{ backgroundColor: '#4064ce', position: 'static', minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Content style={{ background: '#fff', borderRadius: '8px' }}>
          {selectedBoard ? (
            <Board />
          ) : (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#888' }}>
              No board selected. Please select a board from the sidebar.
            </p>
          )}
        </Content>
        <ProjectCanvas />
      </Layout>
    </Layout>
  );
}
