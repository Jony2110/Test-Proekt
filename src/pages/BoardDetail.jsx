
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "CARD";

const BoardDetail = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [cards, setCards] = useState({
        backlog: [],
        todo: [],
        inProgress: [],
        review: [],
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBoard = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const response = await fetch(`https://trello.vimlc.uz/api/boards/${boardId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }

                    const data = await response.json();
                    setBoard(data.board);
                } catch (err) {
                    setError(err.message || "Failed to load board");
                }
            } else {
                setError("User is not authenticated. Please log in.");
            }
        };

        fetchBoard();
    }, [boardId]);

    const addCard = (category, newCard) => {
        setCards((prevCards) => ({
            ...prevCards,
            [category]: [...prevCards[category], newCard],
        }));
    };

    const moveCard = (id, toColumn) => {
        const fromColumn = Object.keys(cards).find((column) =>
            cards[column].some((card) => card.id === id)
        );
        const card = cards[fromColumn].find((card) => card.id === id);

        setCards((prevCards) => ({
            ...prevCards,
            [fromColumn]: prevCards[fromColumn].filter((card) => card.id !== id),
            [toColumn]: [...prevCards[toColumn], card],
        }));
    };

    const handleAddCard = async (e, category) => {
        e.preventDefault();
        const cardText = e.target.elements.newCard.value.trim();

        if (cardText) {
            const token = localStorage.getItem("authToken");

            if (!token) {
                console.error("Токен не найден. Пожалуйста, авторизуйтесь.");
                return;
            }

            const newTaskData = {
                title: cardText,
                description: "Task description",
                status: "Pending",
                priority: "Medium",
                dueDate: "2023-12-31",
                boardId: boardId, 
                assignedTo: "dehonda@gmail.com"
            };

            try {
                const response = await fetch(
                    "https://trello.vimlc.uz/api/tasks/create",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify(newTaskData),
                    }
                );

                const result = await response.json();

                if (response.ok) {
                    const createdCard = { id: result.id, text: cardText };
                    addCard(category, createdCard);
                    e.target.reset();
                } else {
                    console.error("Ошибка при добавлении карточки:", result.message);
                }
            } catch (error) {
                console.error("Ошибка при выполнении запроса:", error);
            }
        }
    };


return (
        <DndProvider backend={HTML5Backend}>
            <div className="ml-12">
                {error && <p className="text-red-500">{error}</p>}
                {board ? (
                    <div>
                        <h1 className="text-2xl font-bold">{board.name}</h1>
                        <p>{board.description}</p>
                        <p>Color: {board.color}</p>

                        <div className="flex justify-between p-4 space-x-4">
                            {Object.keys(cards).map((category) => (
                                <Column
                                    key={category}
                                    category={category}
                                    cards={cards[category]}
                                    moveCard={moveCard}
                                    handleAddCard={handleAddCard}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Loading board...</p>
                )}
            </div>
        </DndProvider>
    );
};

const Column = ({ category, cards, moveCard, handleAddCard }) => {
    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item) => {
            moveCard(item.id, category);
        },
    });

    return (
        <div ref={drop} className="bg-white p-4 w-1/4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4 capitalize">{category}</h2>
            <form onSubmit={(e) => handleAddCard(e, category)} className="mb-4">
                <input
                    type="text"
                    name="newCard"
                    placeholder={`Добавить ${category}`}
                    className="border border-gray-300 rounded w-full p-2 mb-2 focus:outline-none focus:border-blue-400"
                />
                <button type="submit" className="text-blue-600 hover:underline">
                    + Добавить карточку
                </button>
            </form>
            <ul>
                {cards.map((card) => (
                    <Card key={card.id} card={card} />
                ))}
            </ul>
        </div>
    );
};

const Card = ({ card }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: card.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`bg-gray-100 p-2 rounded mb-2 shadow-sm ${
                isDragging ? "opacity-50" : ""
            }`}
        >
            {card.text}
        </div>
    );
};

export default BoardDetail;