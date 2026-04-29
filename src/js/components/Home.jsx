import React, { useState, useEffect } from "react";
import { X, Plus, ClipboardList, Loader2, Check } from 'lucide-react';

const Home = () => {
    
    const [inputValue, setInputValue] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [updatingId, setUpdatingId] = useState (null)
    const [todos, setTodos] = useState ([]);
    const [isLoading, setIsLoading] = useState(false)
    const userName = "lnkr";

    //GET
	async function getTasks () {
        setIsLoading (true);
        try {
            let response = await fetch (`https://playground.4geeks.com/todo/users/${userName}`);
            if (response.ok) {
                let data = await response.json();
                setTodos(data.todos);
                console.log("data", data)
            }
            
        } catch (error) {
            console.error ("Error cargando tareas:", error);
        } finally {
            setIsLoading (false);
        }
	}

    //POST
    
    async function postTask () {
        if (inputValue.trim() === "") return;

        let newTask = {
            "label": inputValue.trim(),
            "is_done": false
        };

        try {
            let response = await fetch ( `https://playground.4geeks.com/todo/todos/${userName}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }
            });
        
            if (response.ok){
            let dataPost = await response.json(); 
            setTodos([...todos,dataPost]);
            setInputValue("");
             }
        } catch (error) {
            console.error("Error al crear:",error);
        }     
 }

 //DELETE
 const deleteTask = async (idToDelete) => {
        setDeletingId(idToDelete);
        
        try {
            let response = await fetch(`https://playground.4geeks.com/todo/todos/${idToDelete}`, {
                method: "DELETE"
            });

            if (response.ok) {
                const newTodos = todos.filter((todo) => todo.id !== idToDelete);
                setTodos(newTodos);
            }
        } catch (error) {
            console.error("Error al borrar:", error);
        } finally {
            setDeletingId(null);
        }
    };

//PUT

const toggleTaskDone = async (todo) => {
         setUpdatingId(todo.id);

         const updatedTask = {
            label: todo.label,
            is_done: !todo.is_done
         };

         try {
            let response = await fetch (`https://playground.4geeks.com/todo/todos/${todo.id}`, {
                method: "PUT",
                body: JSON.stringify (updatedTask),
                headers: { "Content-Type": "application/json" }
         });

         if (response.ok) {
            let dataPut = await response.json ();
            const newTodos = todos.map (t => t.id === todo.id ? dataPut : t);
            setTodos(newTodos);
         }
    } catch (error) {
    console.error ("Error al actualizar:", error);
    } finally {
    setUpdatingId (null);
        }

};
useEffect (() => {
    getTasks ();
}, []);
    console.log (todos)
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            postTask();
        }
    };
console.log(todos)

    return (
        <div className="todo-container">
        {isLoading && (
            <div className="loading-overlay">
                <Loader2 className="rotating" /> 
                <span>Cargando...</span>
            </div>
        )}
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
                            <button onClick={postTask} className="add-button">
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
                                todos.map((todo) => (
                                    <li key={todo.id} className={`todo-item ${deletingId === todo.id ? 'deleting' : ''}`} >
                                        <div className="todo-content" onClick={ () => toggleTaskDone (todo)} 
                                        style={{cursor: updatingId === todo.id ? 'wait' : 'pointer',
                                             pointerEvents: updatingId === todo.id ? 'none' : 'auto' }}
                                            >
                                            <div className={`todo-bullet ${todo.is_done ? 'done' : ''}`}>
                                                {updatingId === todo.id ? (
                                                    <Loader2 size={12} className="rotating" />
                                                ) : todo.is_done ? (
                                                    <Check size={14} strokeWidth={3} />
                                                ) : null}
                                            </div>
                                            <span className={`todo-text ${ todo.is_done ? 'line-through' : ''} `}>{todo.label}</span>
                                        </div>
                                        
                                        <button
                                            onClick={() => deleteTask (todo.id)}
                                            disabled={deletingId === todo.id}
                                            className="delete-button"
                                            aria-label="Eliminar tarea"
                                        >
                                            <X 
                                                size={20} 
                                                className={deletingId === todo.id ? 'rotating' : ''} 
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