import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';

export default function Board() {
  const [tasks, setTasks] = useState({
    NOT_STARTED: [
      {
        id: 1,
        heading: '[Advance Payment]: Implementing UpdatePaymentConfiguraiton API',
        assigneeId: 'Ikshit',
        startDate: new Date('2021-09-01'),
        dueDate: new Date('2021-09-10'),
        description: 'Something about the task here !!',
        priority: 'Low',
        status: 'At-Risk',
      },
      {
        id: 2,
        heading: 'Another Payments',
        assigneeId: 'Some Radom User',
        startDate: new Date(),
        dueDate: new Date(),
        description: 'Something about the task here !!',
        priority: ' Low',
        status: 'At-Risk',
      },
    ],
    IN_PROGRESS: [],
    BLOCKED: [],
    DONE: [
      {
        id: 3,
        heading: 'Advance Payments',
        assigneeId: 'user_id',
        startDate: Date(),
        dueDate: Date(),
        description: 'Something about the task here !!',
        priority: 'Low',
        status: 'At-Risk',
      },
    ],
  });

  const onDragEnd = (result) => {
    // TODO: Update the logic for moving the tasks here and there.
    const { source, destination } = result;
    // If no destination, do nothing
    if (!destination) return;
    // If source and destination are the same, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    // Remove task from source list
    const sourceTasks = Array.from(tasks[source.droppableId]);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    // Add task to destination list
    const destinationTasks = Array.from(tasks[destination.droppableId]);
    destinationTasks.splice(destination.index, 0, movedTask);
    // Update state
    setTasks({
      ...tasks,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destinationTasks,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-container">
        {Object.keys(tasks).map((columnId) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="section-container">
                <div className="task-details">
                  <div className="section-header">
                    <h3 className="section-heading"> {columnId.replace('_', ' ')} </h3>
                  </div>
                  {tasks[columnId].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task key={task.id} task={task}></Task>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
