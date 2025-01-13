import { useState } from 'react';
import { Tag, Drawer, Button } from 'antd';

export default function Task({ task }) {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const beginDate = new Date(task.startDate);
  const startDate = beginDate.getDate();
  const startMonth = beginDate.toLocaleString('default', { month: 'short' });
  const dueDate = new Date(task.dueDate);
  const endDate = dueDate.getDate();
  const endMonth = dueDate.toLocaleString('default', { month: 'short' });

  const closeDrawer = () => {
    console.log('closing the drawer');
    setDrawerVisible(false);
  };

  return (
    <div
      onClick={() => {
        // console.log('do something here');
        setDrawerVisible(true);
      }}
      className="task-card"
    >
      <div className="task-heading">
        <strong> {task.heading} </strong>
      </div>
      <div className="task-details">
        {task.assigneeId != null ? (
          <div style={{ fontSize: '17px', marginTop: '10  px', marginBottom: '10px' }}>
            {' '}
            Assignee: {task.assigneeId}{' '}
          </div>
        ) : null}
        <div>
          {task.startDate != null && task.dueDate != null ? (
            <div style={{ fontSize: '17px', marginTop: '10px', marginBottom: '10px' }}>
              {startDate} {startMonth}- {endDate} {endMonth}{' '}
            </div>
          ) : null}
        </div>
        {task.priority != null ? (
          <Tag
            style={{
              fontSize: '17px',
              justifyContent: 'center',
              textAlign: 'center',
              height: '30px',
              width: '80px',
              marginTop: '15px',
            }}
            color="blue"
          >
            <div style={{ marginTop: '3px' }}>{task.priority}</div>
          </Tag>
        ) : null}
        {task.status != null ? (
          <Tag
            style={{
              fontSize: '17px',
              justifyContent: 'center',
              textAlign: 'center',
              height: '30px',
              width: '80px',
              marginTop: '10px',
              marginBottom: '10px',
            }}
            color="red"
          >
            <div style={{ marginTop: '3px' }}>{task.status}</div>
          </Tag>
        ) : null}
        <Drawer
          value={isDrawerVisible}
          title="Task Details"
          placement="right"
          onClose={closeDrawer}
          visible={isDrawerVisible}
          width="50%"
        >
          <p>
            <strong>Description:</strong> {task.description || 'No description available.'}
          </p>
          <p>
            <strong>Start Date:</strong> {startDate} {startMonth}
          </p>
          <p>
            <strong>Due Date:</strong> {endDate} {endMonth}
          </p>
          <p>
            <strong>Assignee:</strong> {task.assigneeId || 'Unassigned'}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority || 'Not specified'}
          </p>
          <p>
            <strong>Status:</strong> {task.status || 'Not specified'}
          </p>
        </Drawer>
      </div>
    </div>
  );
}
