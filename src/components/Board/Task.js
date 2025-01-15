import { useState } from 'react';
import { Tag, Drawer } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Task({ columnId, taskId, task, handleDescriptionChange, handleDateChange }) {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const beginDate = new Date(task.startDate);
  const startDate = beginDate.getDate();
  const startMonth = beginDate.toLocaleString('default', { month: 'short' });
  const dueDate = new Date(task.dueDate);
  const endDate = dueDate.getDate();
  const endMonth = dueDate.toLocaleString('default', { month: 'short' });

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div
      onClick={() => {
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
          open={isDrawerVisible}
          width="50%"
        >
          <div style={{ padding: '16px', fontFamily: 'Monaco, sans-serif' }}>
            <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>{task.heading}</h2>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Dates</h3>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <label
                  htmlFor="startDate"
                  style={{
                    display: 'inline-block',
                    fontWeight: 'bold',
                    marginRight: '10px',
                    width: '100px',
                    textAlign: 'right',
                  }}
                >
                  Start Date:
                </label>
                <DatePicker
                  id="startDate"
                  selected={beginDate}
                  value={beginDate}
                  onChange={(date) => handleDateChange(columnId, task.id, 'startDate', date)}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                  dateFormat="yyyy-MM-dd"
                  showYearDropdown
                  scrollableMonthYearDropdown
                />
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <label
                  htmlFor="endDate"
                  style={{
                    display: 'inline-block',
                    fontWeight: 'bold',
                    marginRight: '10px',
                    width: '100px',
                    textAlign: 'right',
                  }}
                >
                  End Date:
                </label>
                <DatePicker
                  id="endDate"
                  selected={dueDate}
                  value={dueDate}
                  onChange={(date, dateString) => {
                    console.log('Selected Date:', date, 'Formatted:', dateString);
                    handleDateChange(columnId, task.id, 'dueDate', date);
                  }}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Assignee</h3>
              <p style={{ margin: '0 0 16px 0', paddingLeft: '10px' }}>
                <strong>Assigned To:</strong> {task.assigneeId || 'Unassigned'}
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Details</h3>
              <p style={{ margin: '0 0 12px 0', paddingLeft: '10px' }}>
                <strong>Priority:</strong>{' '}
                <span
                  style={{
                    color: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'green',
                  }}
                >
                  {task.priority || 'Not specified'}
                </span>
              </p>
              <p style={{ margin: '0', paddingLeft: '10px' }}>
                <strong>Status:</strong>{' '}
                <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {task.status || 'Not specified'}
                </span>
              </p>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Description</h3>
              <textarea
                id="taskDescription"
                value={task.description || ''}
                onChange={(e) => handleDescriptionChange(columnId, taskId, e.target.value)}
                placeholder="Enter task description..."
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  resize: 'none',
                }}
              />
            </section>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
