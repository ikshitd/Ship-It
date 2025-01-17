import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task.js';
import { Button } from 'antd';
import { useAppContext } from '../../context/Context.js';
import axios from 'axios';
import socket from '../../socket/socket.js';

export default function Board({ board }) {
  const { userId, handleDescriptionChange, handleDateChange } = useAppContext();
  const DEFAULT_COLUMNS = ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

  const [tasks, setTasks] = useState({
    ...DEFAULT_COLUMNS.reduce((acc, column) => ({ ...acc, [column]: [] }), {}),

    ...(Array.isArray(board.tasks) ? board.tasks : []).reduce((acc, task) => {
      const taskCategory = task.taskCategory;
      if (DEFAULT_COLUMNS.includes(taskCategory)) {
        acc[taskCategory] = acc[taskCategory] || [];
        acc[taskCategory].push(task);
      }
      return acc;
    }, {}),
  });

  useEffect(() => {
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        Object.keys(updatedTasks).forEach((category) => {
          updatedTasks[category] = updatedTasks[category].filter((task) => task.id !== updatedTask.id);
        });
        updatedTasks[updatedTask.taskCategory].push(updatedTask);
        return updatedTasks;
      });
    });
    return () => {
      socket.off('taskUpdated');
    };
  }, []);

  async function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    const sourceColumn = tasks[source.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);
    const destinationColumn = tasks[destination.droppableId];
    destinationColumn.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destinationColumn,
    });
    socket.emit('taskMoved', {
      boardId: board.id,
      taskId: movedTask.id,
      newCategory: destination.droppableId,
    });
  }

  async function addTask(e, columnId) {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3001/add-task',
        {
          userId: userId,
          boardId: board.id,
          columnId: columnId,
          taskDetails: {},
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
    } catch (err) {
      console.error('Unable to create a new task: ', err);
    }
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      style={{
        transitionDuration: '0s',
        transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
        willChange: 'transform',
      }}
    >
      <div className="board-container">
        {DEFAULT_COLUMNS.map((columnId) => (
          <Droppable
            key={columnId}
            droppableId={columnId}
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={true}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="section-container">
                <div className="task-details">
                  <div className="section-header">
                    <h3 className="section-heading"> {columnId.replace('_', ' ')} </h3>
                    <Button
                      style={{ fontSize: '13px' }}
                      type="secondary"
                      size="small"
                      onClick={(e) => addTask(e, columnId)}
                    >
                      Add Task
                    </Button>
                  </div>
                  {tasks[columnId].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task
                            board={board}
                            columnId={columnId}
                            taskId={task.id}
                            handleDescriptionChange={handleDescriptionChange}
                            handleDateChange={handleDateChange}
                            key={task.id}
                            task={task}
                          ></Task>
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
