import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import { Button } from 'antd';
import { useAppContext } from '../../context/Context';

export default function Board({ board }) {
  const { handleDescriptionChange, handleDateChange } = useAppContext();
  const tasks = board.tasks;

  function onDragEnd(result) {
    // TODO: Update the logic for moving the tasks here and there.
  }

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
                    <Button style={{ fontSize: '17px' }} type="primary" size="medium">
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
                            boardId={board.id}
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
