import  { useState } from "react";


import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const initialCards = [
  { id: '1', content: 'Card 1' },
  { id: '2', content: 'Card 2' },
  { id: '3', content: 'Card 3' },
  { id: '4', content: 'Card 4' },
];

function Home() {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");





  const [cards, setCards] = useState(initialCards);


  const onDragEnd = (result) => {
    if (!result.destination) return; 

    const newCards = Array.from(cards);
    const [movedCard] = newCards.splice(result.source.index, 1); 
    newCards.splice(result.destination.index, 0, movedCard);

    setCards(newCards);
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    const newBoard = {
      name: boardName,
      description: description,
      color: color,
    };

    try {
      const response = await fetch("https://trello.vimlc.uz:8000/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBoard),
      });

      const data = await response.json();

      if (response.ok) {
        
        setSuccess("Board created successfully!");
        setError(""); 
       
        document.getElementById("my_modal_1").close();
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

  return (
    <div className="p-6 flex-1 bg-gray-50">
      <h2>All Task</h2>
      <div className="flex gap-3 mt-6 mb-10">
        <div>
          <div
            className="border-2 rounded-md text-center p-4 cursor-pointer"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <h1>Create New Board</h1>
            <p>Click here to create a new board</p>
            
          </div>
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
      </div>
      



      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ padding: 20, width: 300, background: '#f0f0f0' }}
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: 16,
                        margin: '0 0 8px 0',
                        background: '#fff',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {card.content}
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
  );
}

export default Home;
