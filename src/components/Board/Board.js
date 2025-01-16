import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Task from './Task.js';
import { Button } from 'antd';
import { useAppContext } from '../../context/Context.js';
export default function Board({ board }) {
  const { handleDescriptionChange, handleDateChange, updateBoard } = useAppContext();
  const DEFAULT_COLUMNS = ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

  const tasks = {
    ...DEFAULT_COLUMNS.reduce((acc, column) => ({ ...acc, [column]: [] }), {}),
    ...board.tasks,
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    const sourceColumn = tasks[source.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);
    const destinationColumn = tasks[destination.droppableId];
    destinationColumn.splice(destination.index, 0, movedTask);
    updateBoard(board, source, destination, sourceColumn, destinationColumn);
  }

  function addTask(columnId) {
    console.log(`Adding the task: ${columnId}`);
    // TODO: To add the logic for addition of the tasks.
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
                      onClick={() => addTask(columnId)}
                    >
                      Add Task
                    </Button>
                  </div>
                  {tasks[columnId].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
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
