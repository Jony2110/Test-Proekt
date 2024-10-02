import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Modal from "react-modal"; // используем библиотеку react-modal для модальных окон

const ItemType = "CARD";

const BoardDetail = () => {
    const { boardId } = useParams();
    const [cards, setCards] = useState({
        backlog: [],
        todo: [],
        inProgress: [],
        review: [],
    });
    const [selectedTask, setSelectedTask] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBoard = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const response = await fetch(`https://trello.vimlc.uz/api/tasks/${boardId}`, {
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

    const moveCard = (id, fromColumn, toColumn) => {
        const cardToMove = cards[fromColumn].find((card) => card.id === id);

        const updatedFromColumn = cards[fromColumn].filter((card) => card.id !== id);
        const updatedToColumn = [...cards[toColumn], { ...cardToMove }];

        setCards({
            ...cards,
            [fromColumn]: updatedFromColumn,
            [toColumn]: updatedToColumn,
        });
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
                    const createdCard = { id: result.id, title: cardText, status: category };
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

    const openModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleTaskUpdate = async (updatedTask) => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.error("Токен не найден. Пожалуйста, авторизуйтесь.");
            return;
        }

        try {
            const response = await fetch(`https://trello.vimlc.uz/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                
                setCards((prevCards) => {
                    const updatedCards = { ...prevCards };
                    const category = updatedTask.status || "backlog";
                    updatedCards[category] = updatedCards[category].map((card) =>
                        card.id === updatedTask.id ? updatedTask : card
                    );
                    return updatedCards;
                });
                closeModal();
            } else {
                console.error("Ошибка при обновлении задачи:", response.statusText);
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
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
                            openModal={openModal} // добавляем функцию открытия модального окна
                        />
                    ))}
                </div>
                {selectedTask && (
                    <TaskModal
                        task={selectedTask}
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        onUpdate={handleTaskUpdate}
                    />
                )}
            </div>
        </DndProvider>
    );
};

const Column = ({ category, cards, moveCard, handleAddCard, openModal }) => {
    const [, drop] = useDrop({
        accept: ItemType,
        drop: (item) => {
            moveCard(item.id, item.fromColumn, category);
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
                    <Card key={card.id} card={card} moveCard={moveCard} fromColumn={category} openModal={openModal} />
                ))}
            </ul>
        </div>
    );
};

const Card = ({ card, moveCard, fromColumn, openModal }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: card.id, fromColumn },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`bg-gray-100 p-2 rounded mb-2 shadow-sm ${isDragging ? "opacity-50" : ""}`}
            onClick={() => openModal(card)} // открываем модал по клику
        >
            <h3 className="font-bold">{card.title}</h3>
        </div>
    );
};

// Компонент модального окна для редактирования задачи
const TaskModal = ({ task, isOpen, onRequestClose, onUpdate }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState(task.priority || "low");

    const handleSave = () => {
        const updatedTask = {
            ...task,
            title,
            description,
            priority,
        };
        onUpdate(updatedTask);
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2 className="text-lg font-bold">Редактировать задачу</h2>
            <form>
                <div>
                    <label>Название:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border border-gray-300 rounded w-full p-2 mb-2"
                    />
                </div>
                <div>
                    <label>Описание:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 rounded w-full p-2 mb-2"
                    />
                </div>
                <div>
                    <label>Приоритет:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border border-gray-300 rounded w-full p-2 mb-2">
                        <option value="low">Низкий</option>
                        <option value="medium">Средний</option>
                        <option value="high">Высокий</option>
                    </select>
                </div>
                <button type="button" onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Сохранить</button>
                <button type="button" onClick={onRequestClose} className="bg-red-500 text-white p-2 rounded ml-2">Закрыть</button>
            </form>
        </Modal>
    );
};

export default BoardDetail;
