import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task.js';
import { Button, Select, Input, Drawer, DatePicker } from 'antd';
import { useAppContext } from '../../context/Context.js';
import axios from 'axios';
import socket from '../../socket/socket.js';
import dayjs from 'dayjs';

export default function Board({ board }) {
  const { userId } = useAppContext();
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
  const { Option } = Select;

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
        <div className="board-container" style={{ height: '900px' }}>
          {DEFAULT_COLUMNS.map((columnId) => (
            <Droppable
              key={columnId}
              droppableId={columnId}
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={true}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="section-container column"
                >
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
        <form>
          <div style={{ padding: '16px', fontFamily: 'Monaco, sans-serif' }}>
            <section style={{ marginBottom: '24px', textAlign: 'center' }}>
              {isEditing ? (
                <Input
                  value={updatedTaskDetails.heading}
                  onChange={(e) => {
                    handleInputChange('heading', e.target.value);
                  }}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <h3 onClick={() => setIsEditing(true)}>{updatedTaskDetails.heading}</h3>
              )}
            </section>
            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Dates</h3>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <label htmlFor="startDate" style={{ marginRight: '10px' }}>
                  Start Date:
                </label>
                <DatePicker
                  id="startDate"
                  value={updatedTaskDetails.startDate ? dayjs(updatedTaskDetails.startDate) : null}
                  onChange={(date) => handleInputChange('startDate', date ? date.toISOString() : null)}
                  format="YYYY-MM-DD"
                />
              </div>
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <label htmlFor="endDate" style={{ marginRight: '10px' }}>
                  End Date:
                </label>
                <DatePicker
                  id="endDate"
                  value={updatedTaskDetails.dueDate ? dayjs(updatedTaskDetails.dueDate) : null}
                  onChange={(date) => handleInputChange('dueDate', date ? date.toISOString() : null)}
                  format="YYYY-MM-DD"
                />
              </div>
            </section>
            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Priority</h3>
              <Select
                value={updatedTaskDetails.priority}
                onChange={(value) => handleInputChange('priority', value)}
                style={{ width: '100%' }}
              >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </section>
            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Status</h3>
              <Select
                value={updatedTaskDetails.status.replace('_', ' ')}
                onChange={(value) => handleInputChange('status', value.replace(/\s+/g, '_'))}
                style={{ width: '100%' }}
              >
                <Option value="On Track">On Track</Option>
                <Option value="At Risk">At Risk</Option>
                <Option value="Off Risk">Off Risk</Option>
              </Select>
            </section>
            <section style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '16px', color: '#4a4a4a', textAlign: 'left' }}>Task Description</h3>
              <textarea
                value={updatedTaskDetails.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
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
                  resize: 'none',
                }}
              />
            </section>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button type="primary" onClick={handleSubmit} style={{ width: '50%' }}>
                Add-Task
              </Button>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
