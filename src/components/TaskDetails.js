import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Select, Input, Drawer, DatePicker, Divider } from 'antd';
import dayjs from 'dayjs';
import { fetchComments } from '../redux/slices/boardSlice.js';

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
  const [comments, setComments] = useState([]);
  const { Option } = Select;
  const dispatch = useDispatch();

  const fetchAndLoadComments = async () => {
    const response = await dispatch(fetchComments(taskId)).unwrap();
    const sortedComments = [...response].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setComments(sortedComments);
  };

  useEffect(() => {
    if (isDrawerVisible && heading === 'Update Task') {
      fetchAndLoadComments();
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
            <textarea
              value={updatedTaskDetails.description}
              onChange={async (e) => {
                handleInputChange('description', e.target.value);
                // const res = await axios.post('http://localhost:11434/api/generate', {
                //   model: 'smollm:135m',
                //   prompt: e.target.value,
                //   stream: false,
                // });
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
          <Divider> COMMENTS </Divider>
          <section style={{ marginBottom: '30px' }}>
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                backgroundColor: '#f9f9f9',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div
                    key={index}
                    style={{
                      minHeight: '40px',
                      height: '100%',
                      borderStyle: 'solid',
                      marginBottom: '10px',
                      borderWidth: '1px',
                      borderColor: '#f5bf42',
                    }}
                  >
                    <div>
                      <p>
                        <strong> {comment.user.name} </strong>
                        <span style={{ color: '#333' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                      </p>
                    </div>
                    <p style={{ color: '#444' }}>{comment.content}</p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#888' }}>No comments yet.</p>
              )}
            </div>
          </section>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button type="primary" onClick={handleSubmit} style={{ width: '30%' }}>
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
