import Task from './Task';

export default function Section({ title, tasks }) {
  return (
    <div className="section-container">
      <h3> {title} </h3>
      <ul>
        {tasks.map((task) => {
          return <Task task={task} />;
        })}
      </ul>
    </div>
  );
}
