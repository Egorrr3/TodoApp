import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialTodos = [
  { id: 1, text: 'Task 1' },
  { id: 2, text: 'Task 2' },
  { id: 3, text: 'Task 3' },
];

const App = () => {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : initialTodos;
  });

  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const generateUniqueId = () => Math.floor(Math.random() * 1000000);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTodos = Array.from(todos);
    const [reorderedItem] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, reorderedItem);

    setTodos(updatedTodos);
  };

  const addTodo = () => {
    if (newTodoText.trim() === '') return;

    const newTodo = {
      id: generateUniqueId(),
      text: newTodoText,
    };

    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const updateTodo = (id, newText) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Todo List Application</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="New Todo"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              className="list-group"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      className="list-group-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {todo.text}
                      <div className="float-end">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            const updatedText = prompt('Edit todo:', todo.text);
                            if (updatedText !== null) {
                              updateTodo(todo.id, updatedText);
                            }
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
