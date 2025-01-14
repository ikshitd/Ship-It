import { Tag } from 'antd';

export default function Task({ task }) {
  const beginDate = new Date(task.startDate);
  const startDate = beginDate.getDate();
  const startMonth = beginDate.toLocaleString('default', { month: 'short' });
  const dueDate = new Date(task.dueDate);
  const endDate = dueDate.getDate();
  const endMonth = dueDate.toLocaleString('default', { month: 'short' });

  return (
    <div
      onClick={() => {
        console.log(`The task with id = ${task.id} is being clicked`);
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
      </div>
    </div>
  );
}
