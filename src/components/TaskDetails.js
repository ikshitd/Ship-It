import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Select, Input, Drawer, DatePicker, Divider } from 'antd';
import dayjs from 'dayjs';
import { addComment, fetchComments, fetchTask } from '../redux/slices/boardSlice.js';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';

export default function TaskDetails({
  taskId,
  heading,
  isDrawerVisible,
  setDrawerVisible,
  isEditing,
  updatedTaskDetails,
  setIsEditing,
  handleInputChange,
  handleSubmit,
  removeTask,
}) {
  const { userId } = useSelector((state) => state.board);
  const [comments, setComments] = useState([]);
  const [aiGeneratedResponse, setAIGeneratedResponse] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { Option } = Select;
  const dispatch = useDispatch();

  const fetchAndLoadComments = async () => {
    const response = await dispatch(fetchComments(taskId)).unwrap();
    const sortedComments = [...response].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setComments(sortedComments);
  };

  const fetchAIGeneratedResponse = async () => {
    const taskDetails = await dispatch(fetchTask(taskId)).unwrap();
    setAIGeneratedResponse(taskDetails.aiGeneratedResponse);
  };

  const handlePostComment = async () => {
    try {
      const addedComment = await dispatch(
        addComment({ content: commentText, taskId: taskId, userId: userId })
      ).unwrap();
      setComments((prevComments) => [addedComment, ...prevComments]);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
    setCommentText('');
  };

  useEffect(() => {
    if (isDrawerVisible && heading === 'Update Task') {
      fetchAndLoadComments();
      fetchAIGeneratedResponse();
    }
  }, [isDrawerVisible]);

  return (
    <Drawer
      value={isDrawerVisible}
      title={<h2 style={{ fontWeight: 'bold', margin: 0 }}>{heading}</h2>}
      placement="right"
      onClose={() => {
        setDrawerVisible(false);
      }}
      closable={true}
      open={isDrawerVisible}
      width="50%"
      motion={{
        motionAppear: true,
      }}
    >
      <form>
        <div style={{ padding: '16px' }}>
          <section style={{ marginBottom: '24px', textAlign: 'center' }}>
            {isEditing ? (
              <Input
                value={updatedTaskDetails.heading}
                onChange={(e) => {
                  handleInputChange('heading', e.target.value);
                }}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <h3 onClick={() => setIsEditing(true)}>{updatedTaskDetails.heading}</h3>
            )}
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Dates</h3>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <label htmlFor="startDate" style={{ marginRight: '10px' }}>
                Start Date:
              </label>
              <DatePicker
                id="startDate"
                value={updatedTaskDetails.startDate ? dayjs(updatedTaskDetails.startDate) : null}
                onChange={(date) => handleInputChange('startDate', date ? date.toISOString() : null)}
                format="YYYY-MM-DD"
              />
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              <label htmlFor="endDate" style={{ marginRight: '10px' }}>
                End Date:
              </label>
              <DatePicker
                id="endDate"
                value={updatedTaskDetails.dueDate ? dayjs(updatedTaskDetails.dueDate) : null}
                onChange={(date) => handleInputChange('dueDate', date ? date.toISOString() : null)}
                format="YYYY-MM-DD"
              />
            </div>
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Priority</h3>
            <Select
              value={updatedTaskDetails.priority}
              onChange={(value) => handleInputChange('priority', value)}
              style={{ width: '100%' }}
            >
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Status</h3>
            <Select
              value={updatedTaskDetails.status.replace('_', ' ')}
              onChange={(value) => handleInputChange('status', value.replace(/\s+/g, '_'))}
              style={{ width: '100%' }}
            >
              <Option value="On Track">On Track</Option>
              <Option value="At Risk">At Risk</Option>
              <Option value="Off Risk">Off Risk</Option>
            </Select>
          </section>
          <section style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Description</h3>
            <Input.TextArea
              value={updatedTaskDetails.description}
              onChange={async (e) => {
                handleInputChange('description', e.target.value);
              }}
              placeholder="Enter task description..."
              style={{
                width: '100%',
                height: '120px',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                outline: 'none',
                backgroundColor: '#f9f9f9',
                resize: 'none',
              }}
            />
          </section>
          {heading === 'Update Task' && aiGeneratedResponse && (
            <section style={{ marginBottom: '30px' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f0f5ff',
                  border: '1px solid #d6e4ff',
                  borderRadius: '8px',
                  color: '#1f1f1f',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  overflowWrap: 'break-word',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    marginBottom: '12px',
                    padding: '2px 10px',
                    background: 'linear-gradient(90deg, #a1c4fd, #c2e9fb, #fbc7a4, #fcd9f7, #d4fc79)',
                    color: '#333',
                    fontSize: '12px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    userSelect: 'none',
                    boxShadow: '0 0 8px rgba(180, 180, 180, 0.2)',
                  }}
                >
                  AI Generated
                </span>
                <ReactMarkdown>{aiGeneratedResponse}</ReactMarkdown>
              </div>
            </section>
          )}
          {heading === 'Update Task' ? (
            <section style={{ marginBottom: '30px' }}>
              <Divider>COMMENTS</Divider>
              <div style={{ marginBottom: '16px' }}>
                <Input.TextArea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db', // soft gray border
                    resize: 'none',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                    backgroundColor: '#fafafa',
                  }}
                />
                <Button
                  type="primary"
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                  style={{
                    borderRadius: '8px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                  }}
                >
                  Post Comment
                </Button>
              </div>
              <div
                style={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  paddingRight: '8px',
                  border: '1px solid #e5e7eb', // subtle border around whole comment container
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#fff', // optional: white bg for contrast
                  boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)', // subtle shadow for premium feel
                }}
              >
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div
                      key={index}
                      style={{
                        borderBottom: '1px solid #e5e7eb', // light bottom border between comments
                        padding: '12px 0',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                          fontSize: '13px',
                          color: '#4b5563',
                          fontWeight: '600',
                          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                        }}
                      >
                        <span>{comment.user.name}</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#111827',
                          lineHeight: '1.5',
                          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      textAlign: 'center',
                      color: '#9ca3af',
                      fontStyle: 'italic',
                      fontSize: '14px',
                    }}
                  >
                    No comments yet.
                  </p>
                )}
              </div>
            </section>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              style={{ width: '30%' }}
            >
              {heading}
            </Button>
            {heading === 'Update Task' ? (
              <Button
                type="secondary"
                onClick={() => {
                  removeTask();
                  setDrawerVisible(false);
                }}
                style={{ width: '30%' }}
              >
                Remove Task
              </Button>
            ) : null}
          </div>
        </div>
      </form>
    </Drawer>
  );
}
