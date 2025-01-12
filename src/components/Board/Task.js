export default function Task({ task }) {
  return (
    <div className="task-card">
      <div className="task-heading">
        <strong>{task.heading}</strong>
      </div>
      <div className="task-details">
        <div>Assignee: {task.assigneeId}</div>
        <div>Start Date: {task.startDate}</div>
        <div>Due Date: {task.dueDate}</div>
        <div>Description: {task.description}</div>
        <div className="task-tags">Tags: {task.tags.length > 0 ? task.tags.join(', ') : 'No Tags'}</div>
      </div>
    </div>
  );
}
