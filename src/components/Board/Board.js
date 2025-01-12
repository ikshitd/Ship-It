import { useState } from 'react';
import Section from './Section';

export default function Board() {
  const [tasks] = useState({
    NOT_STARTED: [
      {
        heading: 'Advance Payments',
        assigneeId: 'user_id',
        startDate: '912102',
        dueDate: '812981',
        description: 'Something about the task here !!',
        priority: 'Low',
        status: 'At-Risk',
        tags: [],
      },
    ],
    IN_PROGRESS: [],
    BLOCKED: [],
    DONE: [],
  });

  return (
    <div className="board-container">
      <Section title="Not-Started" tasks={tasks['NOT_STARTED']} />
      <Section title="In-Progress" tasks={tasks['IN_PROGRESS']} />
      <Section title="Blocked" tasks={tasks['BLOCKED']} />
      <Section title="Done" tasks={tasks['DONE']} />
    </div>
  );
}
