import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@seastan/react-beautiful-dnd";

function Home() {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [boards, setBoards] = useState([]); 
  const [tasks, setTasks] = useState({}); 
  const navigate = useNavigate();

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("User is not authenticated. Please log in.");
      navigate("/login");
      return;
    }

    const newBoard = {
      id: Date.now().toString(),
      name: boardName,
      description: description,
      color: color,
    };

    try {
      const response = await fetch("https://trello.vimlc.uz/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newBoard),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Board created successfully!");
        setError("");
        document.getElementById("my_modal_1").close();
        setBoards([...boards, newBoard]); 
        setTasks((prev) => ({ ...prev, [newBoard.id]: [] })); 
        setBoardName("");
        setDescription("");
        setColor("");
      } else {
        setError(data.message || "Failed to create the board");
      }
    } catch (error) {
      setError("An error occurred while creating the board");
    }
  };

  const handleAddTask = (boardId, taskName) => {
    const newTask = { id: Date.now().toString(), name: taskName };
    setTasks((prevTasks) => ({
      ...prevTasks,
      [boardId]: [...(prevTasks[boardId] || []), newTask],
    }));
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; 

    const sourceTasks = Array.from(tasks[source.droppableId]);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const destinationTasks = Array.from(tasks[destination.droppableId]);

    if (source.droppableId === destination.droppableId) {
      
      sourceTasks.splice(destination.index, 0, movedTask);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: sourceTasks,
      }));
    } else {
      
      destinationTasks.splice(destination.index, 0, movedTask);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      }));
    }
  };

  return (
    <div className="p-6 flex-1 bg-gray-50">
      <h2>All Task</h2>

      <div className="flex gap-5">
        {boards.map((board) => (
          <div key={board.id} className="flex gap-3 mt-6 mb-10">
            <div>
              <div className="border-2 rounded-md text-center p-4 cursor-pointer">
                <h1>{board.name}</h1>
                <p>{board.description}</p>

                {/* Добавление задачи */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const taskName = e.target.elements.taskName.value;
                    if (taskName) {
                      handleAddTask(board.id, taskName);
                      e.target.elements.taskName.value = "";
                    }
                  }}
                >
                  <input
                    name="taskName"
                    placeholder="Enter task name"
                    className="border p-2 w-full rounded-md"
                  />
                  <button type="submit" className="btn mt-2">
                    Add Task
                  </button>
                </form>

                {/* Список задач с drag-and-drop */}
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId={board.id}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks[board.id]?.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-2 mt-2 border rounded-md"
                              >
                                {task.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для создания доски */}
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Create Board
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create a New Board</h3>
          <form onSubmit={handleCreateBoard}>
            <div className="py-4">
              <label className="block mb-2">Board Name:</label>
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="border p-2 w-full rounded-md"
                placeholder="Enter board name"
                required
              />
            </div>
            <div className="py-4">
              <label className="block mb-2">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full rounded-md"
                placeholder="Enter board description"
                required
              />
            </div>
            <div className="py-4">
              <label className="block mb-2">Color:</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border p-2 w-full rounded-md"
                placeholder="Enter board color (e.g., green)"
                required
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <div className="modal-action">
              <button type="submit" className="btn">
                Create Board
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("my_modal_1").close()}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Home;
