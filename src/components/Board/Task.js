import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tag } from 'antd';
import 'react-datepicker/dist/react-datepicker.css';
import socket from '../../socket/socket.js';
import TaskDetails from '../TaskDetails.js';
import { removeTask, updateTask } from '../../redux/slices/boardSlice.js';

export default function Task({ board, columnId, taskId, task }) {
  const dispatch = useDispatch();
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

  const handleInputChange = (field, value) => {
    setUpdatedTaskDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch(updateTask({ boardId: boardId, taskId: taskId, updatedTaskDetails: updatedTaskDetails }));
    socket.emit('taskUpdated', {
      boardId,
      taskId,
      columnId,
      taskDetails: updatedTaskDetails,
    });
    setTimeout(() => {
      setDrawerVisible(false);
    }, 0);
  };

  const removeTaskFromBoard = () => {
    dispatch(removeTask({ boardId: boardId, taskId: taskId }));
    socket.emit('taskRemoved', {
      boardId,
      taskId,
    });
  };

  return (
    <div
      onClick={() => {
        setDrawerVisible(true);
      }}
      className="task-card"
    >
      <div className="task-heading">
        <p style={{ fontSize: '15px' }}> {task.heading} </p>
      </div>
      <div className="task-details">
        {task.assigneeId != null ? (
          <div style={{ marginTop: '5px', marginBottom: '5px' }}> Assignee: {task.assigneeId} </div>
        ) : null}
        <div>
          {task.startDate != null && task.dueDate != null ? (
            <div style={{ fontSize: '15px', marginTop: '3px', marginBottom: '10px' }}>
              {startDate} {startMonth}- {endDate} {endMonth}{' '}
            </div>
          ) : null}
        </div>
        {task.priority != null ? (
          <Tag
            style={{
              fontSize: '13px',
              justifyContent: 'center',
              textAlign: 'center',
              height: '25px',
              width: '63px',
            }}
            color={task.priority === 'High' ? '#ed3e3e' : task.priority === 'Medium' ? '#f7cb2d' : '#57bd5c'}
          >
            <div style={{ marginTop: '1px' }}>{task.priority}</div>
          </Tag>
        ) : null}
        {task.status != null ? (
          <Tag
            style={{
              fontSize: '13px',
              justifyContent: 'center',
              textAlign: 'center',
              height: '25px',
              width: '63px',
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
            <div style={{}}>{task.status.replace('_', ' ')}</div>
          </Tag>
        ) : null}
        <TaskDetails
          taskId={taskId}
          heading="Update Task"
          isDrawerVisible={isDrawerVisible}
          isEditing={isEditing}
          updatedTaskDetails={updatedTaskDetails}
          setIsEditing={setIsEditing}
          handleInputChange={handleInputChange}
          setDrawerVisible={setDrawerVisible}
          handleSubmit={handleSubmit}
          removeTask={removeTaskFromBoard}
        />
      </div>
    </div>
  );
}
