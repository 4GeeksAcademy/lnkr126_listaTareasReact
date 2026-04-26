import React, { useState, useEffect } from "react";
import { X, Plus, ClipboardList } from 'lucide-react';

const Home = () => {
    
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [deletingIndex, setDeletingIndex] = useState(null);

    
    useEffect(() => {
        const savedTodos = JSON.parse(localStorage.getItem('modern-react-todos'));
        if (savedTodos && savedTodos.length > 0) {
            setTodos(savedTodos);
        }
    }, []);

    
    useEffect(() => {
        localStorage.setItem('modern-react-todos', JSON.stringify(todos));
    }, [todos]);

    
    const addTodo = () => {
        if (inputValue.trim() !== "") {
            setTodos([...todos, inputValue.trim()]);
            setInputValue("");
        }
    };

    
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addTodo();
        }
    };

    
    const handleDelete = (indexToDelete) => {
        setDeletingIndex(indexToDelete);
    
        setTimeout(() => {
            const newTodos = todos.filter((_, index) => index !== indexToDelete);
            setTodos(newTodos);
            setDeletingIndex(null);
        }, 300);
    };

    return (
        <div className="todo-container">
            <div className="todo-wrapper">
                
                <div className="todo-header">
                    <h1 className="todo-title">
                        Tareas<span className="dot">.</span>
                    </h1>
                    <p className="todo-subtitle">Organiza tu día de forma creativa y sencilla</p>
                </div>
                
                
                <div className="todo-card">
                    
                    <div className="input-group">
                        <div className="input-icon">
                            <Plus size={24} />
                        </div>
                        <input
                            type="text"
                            className="todo-input"
                            placeholder="¿Qué tienes planeado hoy?"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {inputValue.trim() !== "" && (
                            <button onClick={addTodo} className="add-button">
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        )}
                    </div>

                    
                    <div className="todo-list-container">
                        <ul className="todo-list">
                            {todos.length === 0 ? (
                                <li className="empty-state">
                                    <ClipboardList size={48} className="empty-icon" />
                                    <p>No hay tareas pendientes</p>
                                </li>
                            ) : (
                                todos.map((todo, index) => (
                                    <li
                                        key={index}
                                        className={`todo-item ${deletingIndex === index ? 'deleting' : ''}`}
                                    >
                                        <div className="todo-content">
                                            <div className="todo-bullet"></div>
                                            <span className="todo-text">{todo}</span>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="delete-button"
                                            aria-label="Eliminar tarea"
                                        >
                                            <X 
                                                size={20} 
                                                className={deletingIndex === index ? 'rotating' : ''} 
                                            />
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
                
                
                <p className="todo-footer-note">
                    Presiona <span className="key-hint">Enter</span> para añadir a la lista
                </p>
            </div>
        </div>
    );
};

export default Home;