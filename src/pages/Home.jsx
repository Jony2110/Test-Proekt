import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState("");
    const [boardName, setBoardName] = useState("");
    const [boardDescription, setBoardDescription] = useState("");
    const [boardColor, setBoardColor] = useState("green");
    const navigate = useNavigate();

    const fetchBoards = async () => {
        const token = localStorage.getItem("authToken");

        if (token) {
            try {
                const response = await fetch("https://trello.vimlc.uz/api/boards/my-boards", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                setBoards(data.boards);
            } catch (err) {
                setError(err.message || "Failed to load boards");
            }
        } else {
            setError("User is not authenticated. Please log in.");
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const createBoard = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (token) {
            const newBoard = {
                name: boardName,
                description: boardDescription,
                color: boardColor,
            };

            try {
                const response = await fetch("https://trello.vimlc.uz/api/boards/create", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newBoard),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                await response.json();
                fetchBoards();

                setBoardName("");
                setBoardDescription("");
            } catch (err) {
                setError(err.message || "Failed to create board");
            }
        } else {
            setError("User is not authenticated. Please log in.");
        }
    };

    const handleTask = (boardId) => {
        navigate(`/board/${boardId}`); // Переход на страницу конкретного борда
    };

    return (
        <div className="ml-12">
            <h1>Create a New Board</h1>
            <form className="mt-11 flex gap-4" onSubmit={createBoard}>
                <input
                    className="border border-gray-300 rounded-lg w-48 p-2 mb-4"
                    type="text"
                    placeholder="Board Name"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    required
                />
                <input
                    className="border border-gray-300 rounded-lg w-48 p-2 mb-4"
                    type="text"
                    placeholder="Board Description"
                    value={boardDescription}
                    onChange={(e) => setBoardDescription(e.target.value)}
                    required
                />
                <select
                    className="border border-gray-300 rounded-lg w-48 p-2 mb-4"
                    value={boardColor}
                    onChange={(e) => setBoardColor(e.target.value)}
                >
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                    <option value="gray">Gray</option>
                </select>
                <button className="bg-green-500 text-white rounded-lg w-48 p-2 hover:bg-green-600" type="submit">
                    Create Board
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}

            <ul className="flex flex-wrap gap-5 mt-20">
                {boards.length > 0 ? (
                    boards.map((board) => (
                        <li
                            onClick={() => handleTask(board.id)}
                            className="w-40 h-20 bg-slate-600 p-5 text-white rounded-md hover:cursor-pointer"
                            key={board.id}
                        >
                            {board.name}
                        </li>
                    ))
                ) : (
                    <p>No boards available</p>
                )}
            </ul>
        </div>
    );
};

export default Home;
