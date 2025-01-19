import { useState } from 'react';
import { Tag, Drawer, Input, Select, DatePicker, Button } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppContext } from '../../context/Context.js';
import socket from '../../socket/socket.js';
import dayjs from 'dayjs';

export default function Task({ board, columnId, taskId, task }) {
  const { updateTask, removeTask } = useAppContext();

  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState({
    heading: task.heading,
    startDate: new Date(task.startDate),
    dueDate: new Date(task.dueDate),
    priority: task.priority,
    status: task.status,
    description: task.description || '',
  });

  const boardId = board.id;
  const beginDate = new Date(task.startDate);
  const startDate = beginDate.getDate();
  const startMonth = beginDate.toLocaleString('default', { month: 'short' });
  const dueDate = new Date(task.dueDate);
  const endDate = dueDate.getDate();
  const endMonth = dueDate.toLocaleString('default', { month: 'short' });
  const { Option } = Select;

  const handleInputChange = (field, value) => {
    setUpdatedTaskDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    try {
      updateTask(boardId, taskId, updatedTaskDetails);
      socket.emit('taskUpdated', {
        boardId,
        taskId,
        columnId,
        taskDetails: updatedTaskDetails,
      });
      setTimeout(() => {
        setDrawerVisible(false);
      }, 0);
    } catch (err) {
      console.error('Unable to update the task details', err);
    }
  };

  return (
    <div
      onClick={() => {
        setDrawerVisible(true);
      }}
      className="task-card"
    >
      <div className="task-heading">
        <p style={{ fontSize: '16px' }}> {task.heading} </p>
      </div>
      <div className="task-details">
        {task.assigneeId != null ? (
          <div style={{ fontSize: '16px', marginTop: '10  px', marginBottom: '10px' }}>
            {' '}
            Assignee: {task.assigneeId}{' '}
          </div>
        ) : null}
        <div>
          {task.startDate != null && task.dueDate != null ? (
            <div style={{ fontSize: '16px', marginTop: '10px', marginBottom: '10px' }}>
              {startDate} {startMonth}- {endDate} {endMonth}{' '}
            </div>
          ) : null}
        </div>
        {task.priority != null ? (
          <Tag
            style={{
              fontSize: '16px',
              justifyContent: 'center',
              textAlign: 'center',
              height: '30px',
              width: '80px',
              marginTop: '15px',
            }}
            color={task.priority === 'High' ? '#ed3e3e' : task.priority === 'Medium' ? '#fc7819' : '#03ad2b'}
          >
            <div style={{ marginTop: '3px' }}>{task.priority}</div>
          </Tag>
        ) : null}
        {task.status != null ? (
          <Tag
            style={{
              fontSize: '16px',
              justifyContent: 'center',
              textAlign: 'center',
              height: '30px',
              width: '80px',
              marginTop: '10px',
              marginBottom: '10px',
            }}
            color={
              task.status.replace('_', ' ') === 'On Track'
                ? '#18c4ab'
                : task.status === 'At Risk'
                  ? '#f7b100'
                  : '#171511'
            }
          >
            <div style={{ marginTop: '3px' }}>{task.status.replace('_', ' ')}</div>
          </Tag>
        ) : null}
        <Drawer
          value={isDrawerVisible}
          title={<h2 style={{ fontWeight: 'bold', margin: 0 }}>Task Details</h2>}
          placement="right"
          onClose={() => {
            setDrawerVisible(false);
          }}
          closable={false}
          open={isDrawerVisible}
          width="50%"
          motion={{
            motionAppear: true,
          }}
        >
          <form>
            <div style={{ padding: '16px', fontFamily: 'Monaco, sans-serif' }}>
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
                <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>
                  Task Description
                </h3>
                <textarea
                  value={updatedTaskDetails.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter task description..."
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '12px',
                    fontSize: '16px',
                    fontFamily: 'Monaco',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    outline: 'none',
                    backgroundColor: '#f9f9f9',
                    resize: 'none',
                  }}
                />
              </section>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button type="primary" onClick={handleSubmit} style={{ width: '30%' }}>
                  Update-Task
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    removeTask(boardId, taskId);
                    socket.emit('taskRemoved', {
                      boardId: boardId,
                      taskId: taskId,
                    });
                    setTimeout(() => {
                      setDrawerVisible(false);
                    }, 0);
                  }}
                  style={{ marginLeft: '20px', width: '30%', backgroundColor: '#ed3e3e' }}
                >
                  Remove-Task
                </Button>
              </div>
            </div>
          </form>
        </Drawer>
      </div>
    </div>
  );
}
