import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "CARD";

const BoardDetail = () => {
    const { boardId } = useParams();
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
                    const response = await fetch(`https://trello.vimlc.uz/api/boards/${boardId}/tasks`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }

                    const data = await response.json();
                    organizeTasks(data.tasks);
                } catch (err) {
                    setError(err.message || "Failed to load board tasks");
                }
            } else {
                setError("User is not authenticated. Please log in.");
            }
        };

        fetchBoard();
    }, [boardId]);

    const organizeTasks = (tasks) => {
        const organizedTasks = {
            backlog: [],
            todo: [],
            inProgress: [],
            review: [],
        };

        tasks.forEach((task) => {
            switch (task.status) {
                case "backlog":
                    organizedTasks.backlog.push(task);
                    break;
                case "todo":
                    organizedTasks.todo.push(task);
                    break;
                case "inProgress":
                    organizedTasks.inProgress.push(task);
                    break;
                case "review":
                    organizedTasks.review.push(task);
                    break;
                default:
                    break;
            }
        });

        setCards(organizedTasks);
    };

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

        if (fromColumn === toColumn) {
            return;
        }

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
                boardId: boardId,
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
                    const createdCard = { id: result.id, title: cardText };
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
                {cards.map((card, index) => (
                    <Card key={`${category}-${card.id}-${index}`} card={card} />
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
            <h3 className="font-bold">{card.title}</h3>
            
        </div>
    );
};

export default BoardDetail;
