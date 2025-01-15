import { useState } from 'react';
import { Tag, Drawer } from 'antd';

export default function Task({ columnId, taskId, task, handleDescriptionChange }) {
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
            color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'darkgreen'}
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
          title={<h2 style={{ fontWeight: 'bold', margin: 0 }}>Task Details</h2>}
          placement="right"
          onClose={closeDrawer}
          visible={isDrawerVisible}
          width="40%"
        >
          <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
            <section style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '8px', color: '#4a4a4a' }}>Dates</h3>
              <p>
                <strong>Start Date:</strong> {startDate} {startMonth}
              </p>
              <p>
                <strong>Due Date:</strong> {endDate} {endMonth}
              </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '8px', color: '#4a4a4a' }}>Assignee</h3>
              <p>
                <strong>Assigned To:</strong> {task.assigneeId || 'Unassigned'}
              </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '8px', color: '#4a4a4a' }}>Details</h3>
              <p>
                <strong>Priority:</strong>{' '}
                <span
                  style={{
                    color: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green',
                  }}
                >
                  {task.priority || 'Not specified'}
                </span>
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {task.status || 'Not specified'}
                </span>
              </p>
            </section>

            <section style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '8px', color: '#4a4a4a' }}>Task Description</h3>
              <textarea
                id="taskDescription"
                value={task.description || ''}
                onChange={(e) => handleDescriptionChange(columnId, taskId, e.target.value)}
                placeholder="Enter task description..."
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '8px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  resize: 'vertical',
                }}
              />
            </section>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
