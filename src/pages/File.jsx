import { useState } from "react";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialData = {
  columns: {
    backlog: { name: 'Backlog', items: [] },
    todo: { name: 'To Do', items: [] },
    inProgress: { name: 'In Progress', items: [] },
    review: { name: 'Review', items: [] }
  }
};

Modal.setAppElement('#root');

function File() {
  const [columns, setColumns] = useState(initialData.columns);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState('');

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    // Проверка на то, что элемент остался в том же месте
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Если позиция и колонка не изменились, ничего не делать
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = Array.from(sourceColumn.items);
    const [removed] = sourceItems.splice(source.index, 1);
    const destItems = Array.from(destColumn.items);

    // Если перемещаем в ту же колонку
    if (sourceColumn === destColumn) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
  };

  const addItem = (columnId) => {
    if (!newTaskContent.trim()) return;
    const newTask = { id: Date.now().toString(), content: newTaskContent };

    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        items: [...prevColumns[columnId].items, newTask],
      },
    }));

    setNewTaskContent('');
  };

  const openModal = (task) => {
    setCurrentTask(task);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentTask(null);
  };

  const handleTaskUpdate = (updatedTask) => {
    setColumns((prevColumns) => {
      const columnId = Object.keys(prevColumns).find((id) =>
        prevColumns[id].items.some((item) => item.id === updatedTask.id)
      );

      return {
        ...prevColumns,
        [columnId]: {
          ...prevColumns[columnId],
          items: prevColumns[columnId].items.map((item) =>
            item.id === updatedTask.id ? updatedTask : item
          ),
        },
      };
    });

    closeModal();
  };

  const handleTaskDelete = (taskId) => {
    setColumns((prevColumns) => {
      const columnId = Object.keys(prevColumns).find((id) =>
        prevColumns[id].items.some((item) => item.id === taskId)
      );

      return {
        ...prevColumns,
        [columnId]: {
          ...prevColumns[columnId],
          items: prevColumns[columnId].items.filter((item) => item.id !== taskId),
        },
      };
    });

    closeModal();
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4 p-5">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable droppableId={columnId} key={columnId}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-800 p-4 rounded-md w-64">
                  <h2 className="text-lg font-semibold text-white mb-2">{column.name}</h2>
                  <input
                    type="text"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    placeholder="Введите имя задачи"
                    className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
                  />
                  <button onClick={() => { addItem(columnId); setCurrentColumnId(columnId); }} className="bg-green-600 text-white px-2 py-1 rounded mb-2">
                    Добавить карточку
                  </button>
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => openModal(item)}
                          className="p-2 mb-2 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-700 transition"
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
          {currentTask && (
            <>
              <input
                type="text"
                value={currentTask.content}
                onChange={(e) => setCurrentTask({ ...currentTask, content: e.target.value })}
                placeholder="Task Name"
                className="border border-gray-300 rounded mb-4 w-full p-2"
              />
              <textarea
                value={currentTask.description || ''}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                placeholder="Description"
                className="border border-gray-300 rounded mb-4 w-full p-2"
              />
              <input
                type="text"
                value={currentTask.priority || ''}
                onChange={(e) => setCurrentTask({ ...currentTask, priority: e.target.value })}
                placeholder="Priority"
                className="border border-gray-300 rounded mb-4 w-full p-2"
              />
              <input
                type="date"
                value={currentTask.dueDate || ''}
                onChange={(e) => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
                className="border border-gray-300 rounded mb-4 w-full p-2"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setCurrentTask({
                      ...currentTask,
                      comments: [...(currentTask.comments || []), e.target.value]
                    });
                    e.target.value = '';
                  }
                }}
                className="border border-gray-300 rounded mb-4 w-full p-2"
              />
              <ul className="mb-4">
                {currentTask.comments && currentTask.comments.map((comment, index) => (
                  <li key={index}>{comment}</li>
                ))}
              </ul>
              <div className="flex justify-between">
                <button onClick={() => handleTaskUpdate(currentTask)} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Сохранить задачу
                </button>
                <button onClick={() => handleTaskDelete(currentTask.id)} className="bg-red-600 text-white px-4 py-2 rounded">
                  Удалить задачу
                </button>
                <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded">
                  Закрыть
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default File;
