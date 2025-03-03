import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task.js';
import { Button } from 'antd';
import axios from 'axios';
import socket from '../../socket/socket.js';
import TaskDetails from '../TaskDetails.js';

export default function Board({ board }) {
  const { userId } = useSelector((state) => state.board);
  const DEFAULT_COLUMNS = ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

  const propagateData = (board) => {
    return {
      ...DEFAULT_COLUMNS.reduce((acc, column) => ({ ...acc, [column]: [] }), {}),

      ...(Array.isArray(board.tasks) ? board.tasks : []).reduce((acc, task) => {
        const taskCategory = task.taskCategory;
        if (DEFAULT_COLUMNS.includes(taskCategory)) {
          acc[taskCategory] = acc[taskCategory] || [];
          acc[taskCategory].push(task);
        }
        return acc;
      }, {}),
    };
  };

  const defaultTaskDetails = {
    heading: 'Rufus',
    startDate: null,
    dueDate: null,
    priority: 'Low',
    status: 'Off_Risk',
    description: '',
    taskCategory: 'NOT_STARTED',
  };

  const [tasks, setTasks] = useState(propagateData(board));
  const [category, setCategory] = useState(DEFAULT_COLUMNS.at(0));
  const [isEditing, setIsEditing] = useState(false);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [updatedTaskDetails, setUpdatedTaskDetails] = useState(defaultTaskDetails);

  const handleInputChange = (field, value) => {
    setUpdatedTaskDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  useEffect(() => {
    socket.on('boardSelected', () => {
      setTasks(propagateData(board));
    });
    return () => {
      socket.off('boardSelected');
    };
  }, [board]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/add-task',
        {
          userId: userId,
          boardId: board.id,
          columnId: category,
          taskDetails: updatedTaskDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
          },
        }
      );
      setUpdatedTaskDetails(defaultTaskDetails);
      socket.emit('taskAdded', {
        userId: userId,
        boardId: board.id,
        columnId: category,
        taskDetails: response.data.task,
      });
      setTimeout(() => {
        setDrawerVisible(false);
      }, 0);
    } catch (err) {
      console.error('Unable to create a new task: ', err);
    }
  };

  useEffect(() => {
    socket.on('taskMoved', (updatedTask) => {
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
      socket.off('taskMoved');
    };
  }, [board.id]);

  useEffect(() => {
    socket.on('taskUpdated', (updatedTask) => {
      const { taskId, columnId, taskDetails } = updatedTask;
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        if (updatedTasks[columnId]) {
          const taskIndex = updatedTasks[columnId].findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            updatedTasks[columnId][taskIndex] = { ...updatedTasks[columnId][taskIndex], ...taskDetails };
          }
        } else {
          console.error('Invalid columnId:', columnId);
        }
        return updatedTasks;
      });
    });
    return () => {
      socket.off('taskUpdated');
    };
  }, [board.tasks]);

  useEffect(() => {
    socket.on('taskAdded', (addedTask) => {
      const { boardId, columnId, taskDetails } = addedTask;
      if (board.id === boardId) {
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          if (!updatedTasks[columnId]) {
            updatedTasks[columnId] = [];
          }
          updatedTasks[columnId] = [...updatedTasks[columnId], taskDetails];
          return updatedTasks;
        });
      } else {
        console.warn('Task added to a different board, ignoring.');
      }
    });

    socket.on('taskRemoved', ({ taskId, boardId }) => {
      if (boardId === board.id) {
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          Object.keys(updatedTasks).forEach((category) => {
            updatedTasks[category] = updatedTasks[category].filter((task) => task.id !== taskId);
          });
          return updatedTasks;
        });
      }
    });

    return () => {
      socket.off('taskAdded');
      socket.off('taskRemoved');
    };
  }, [board.tasks, board.id]);

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
    setCategory(columnId);
    setDrawerVisible(true);
  }

  return (
    <div>
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
              ignoreContainerClipping={false}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="section-container column"
                  style={{ position: 'relative' }}
                >
                  <div className="task-details">
                    <div
                      className="section-header"
                      style={{ position: 'sticky', top: '0', backgroundColor: '#fff', zIndex: '2' }}
                    >
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
                    <div style={{ minHeight: '100px' }}>
                      {tasks[columnId].map((task, index) => {
                        const isDone = task.taskCategory === 'DONE';
                        return (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: isDone ? 0.7 : 1,
                                  backgroundColor: isDone ? '#f0f0f0' : '',
                                  marginBottom: '8px', // Add margin between tasks
                                }}
                              >
                                <Task
                                  board={board}
                                  columnId={columnId}
                                  taskId={task.id}
                                  key={task.id}
                                  task={task}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </div>
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <TaskDetails
        heading="Add Task"
        isDrawerVisible={isDrawerVisible}
        isEditing={isEditing}
        updatedTaskDetails={updatedTaskDetails}
        setIsEditing={setIsEditing}
        handleInputChange={handleInputChange}
        setDrawerVisible={setDrawerVisible}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
