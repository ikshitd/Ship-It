import { useState } from 'react';
import { Tag, Drawer, Input, Select } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppContext } from '../../context/Context';

export default function Task({ board, columnId, taskId, task }) {
  const {
    handleDateChange,
    handleDescriptionChange,
    handleTaskHeadingUpdate,
    handlePriorityChange,
    handleStatusChange,
  } = useAppContext();

  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newHeading, setNewHeading] = useState(task.heading);

  const boardId = board.id;
  const beginDate = new Date(task.startDate);
  const startDate = beginDate.getDate();
  const startMonth = beginDate.toLocaleString('default', { month: 'short' });
  const dueDate = new Date(task.dueDate);
  const endDate = dueDate.getDate();
  const endMonth = dueDate.toLocaleString('default', { month: 'short' });
  const { Option } = Select;

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
            color={task.status === 'On Track' ? '#18c4ab' : task.status === 'At Risk' ? '#f7b100' : '#171511'}
          >
            <div style={{ marginTop: '3px' }}>{task.status}</div>
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
          <div style={{ padding: '16px', fontFamily: 'Monaco, sans-serif' }}>
            <section style={{ marginBottom: '24px', textAlign: 'center' }}>
              {isEditing ? (
                <Input
                  value={newHeading}
                  onChange={(e) => {
                    setNewHeading(e.target.value);
                  }}
                  onBlur={() => {
                    handleTaskHeadingUpdate(boardId, columnId, taskId, newHeading);
                    setIsEditing(false);
                  }}
                  autoFocus
                />
              ) : (
                <h3 onClick={() => setIsEditing(true)}>{task.heading}</h3>
              )}
            </section>

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
                  onChange={(date) => handleDateChange(boardId, columnId, task.id, 'startDate', date)}
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
                    handleDateChange(boardId, columnId, task.id, 'dueDate', date);
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
              <strong> Priority: </strong>

              <Select
                value={task.priority}
                onChange={(value) => handlePriorityChange(boardId, columnId, taskId, value)}
                style={{
                  width: '20%',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
                dropdownStyle={{ borderRadius: '2px' }}
              >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>

              <strong> Status: </strong>
              <Select
                value={task.status}
                onChange={(value) => handleStatusChange(boardId, columnId, taskId, value)}
                style={{
                  width: '20%',
                  borderRadius: '8px',
                }}
                dropdownStyle={{ borderRadius: '8px' }}
              >
                <Option value="At Risk">At Risk</Option>
                <Option value="Off Risk">Off Risk</Option>
                <Option value="On Track">On Track</Option>
              </Select>
            </section>

            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Description</h3>
              <textarea
                id="taskDescription"
                value={task.description || ''}
                onChange={(e) => handleDescriptionChange(boardId, columnId, taskId, e.target.value)}
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
