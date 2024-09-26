import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirecting to login



function Home() {
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
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
    </div>
  );
}

export default Home;
