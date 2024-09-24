
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const initialCards = [
  { id: '1', content: 'Card 1' },
  { id: '2', content: 'Card 2' },
  { id: '3', content: 'Card 3' },
  { id: '4', content: 'Card 4' },
];

function File() {
  const [cards, setCards] = useState(initialCards);


  const onDragEnd = (result) => {
    if (!result.destination) return; 

    const newCards = Array.from(cards);
    const [movedCard] = newCards.splice(result.source.index, 1); 
    newCards.splice(result.destination.index, 0, movedCard);

    setCards(newCards);
  };

  

  return (
    <>
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

     
    </>
  );
}

export default File;
