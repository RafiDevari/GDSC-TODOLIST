import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
var x=0;

function TodoApp() {
	function getInitialActivities() {
		const temp = localStorage.getItem("todos");
		const savedtoDo = JSON.parse(temp);
		return savedtoDo || [];
	}

	const [inputValue, setInputValue] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [sortBy, setSortBy] = useState("");
	const [todos, setTodos] = useState(getInitialActivities());
	const [editId, setEditId] = useState(null);
	const [editInputValue, setEditInputValue] = useState("");
	const [editDeadline, setEditDeadline] = useState("");

	useEffect(() => {
		const storedTodos = JSON.parse(localStorage.getItem("todos"));
		if (storedTodos) {
			setTodos(storedTodos);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
	}, [todos]);

	const addTodo = () => {
		if (inputValue.trim() !== "") {
			const deadline = new Date();
			deadline.setDate(deadline.getDate() + 1);
			const deadlineISOString = deadline.toISOString();

			const newTodo = {
				id: x,
				text: inputValue,
				deadline:deadlineISOString,
				completed: false,
				createdAt: new Date().toISOString(),
			};
			x+=1;
			setTodos([...todos, newTodo]);
			setInputValue("");
		}
	};

	const deleteTodo = (id) => {
		const updatedTodos = todos.filter((todo) => todo.id !== id);
		setTodos(updatedTodos);
	};

	const toggleTodo = (id) => {
		const updatedTodos = todos.map((todo) => (todo.id === id && id !== editId ? { ...todo, completed: !todo.completed } : todo));
		setTodos(updatedTodos);
	};

	const handleInputChange = (event) => {
		if (editId === null) {
			setInputValue(event.target.value);
		} else {
			setEditInputValue(event.target.value);
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			if (editId === null) {
				addTodo();
			} else {
				handleSaveEdit(editId, editInputValue);
				setEditId(null);
			}
		}
	};

	const handleFilter = (status) => {
		setFilterStatus(status);
	};

	const handleSortBy = (criteria) => {
		setSortBy(criteria);
		const sortedTodos = [...todos];
		if (criteria === "createdAt") {
			sortedTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
		} else if (criteria === "text") {
			sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
		}
		setTodos(sortedTodos);
	};

	const handleEdit = (id, deadline) => {
		setEditId(id);
		setEditInputValue(todos.find(todo => todo.id === id).text);
		setEditDeadline(deadline); // Set the editDeadline state to the current deadline
	};

	const cancelEdit = () => {
		setEditId(null);
		setEditInputValue('');
		setEditDeadline('');
	};

	const calculateDaysLeft = (deadline) => {
		const today = new Date();
		const deadlineDate = new Date(deadline);
		const differenceInMilliseconds = deadlineDate - today;
		const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
		return differenceInDays;
	};
	

	const handleSaveEdit = (id, newText) => {
		const updatedTodos = todos.map(todo => {
			if (todo.id === id) {
				return {
					...todo,
					text: newText,
					deadline: editDeadline // Update the deadline
				};
			}
			return todo;
		});
		setTodos(updatedTodos);
		setEditId(null);
		setEditInputValue("");
		setEditDeadline(""); // Reset editDeadline after saving the edit
	};

	const filteredTodos =
		filterStatus === "all"
			? todos
			: todos.filter((todo) => {
					if (filterStatus === "completed") {
						return todo.completed === true;
					} else {
						return todo.completed === false;
					}
			  });

	return (
		
		<div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 min-h-screen flex justify-center items-center">

    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-8 ">
		
        <h1 className="text-4xl font-bold text-center mb-6 text-yellow-800">To Do List</h1>
        <div className="flex items-center border-b border-gray-300 py-4 mb-6">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 mr-4 rounded-lg border border-gray-400 focus:outline-none focus:border-yellow-600"
                placeholder="Add List..."
            />
            <button
                onClick={addTodo}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700"
            >
                Add List
            </button>
        </div>
        <div className="flex justify-between items-center mb-6 flex-wrap">
            <div className="flex space-x-4 mb-2 md:mb-0">
                <button
                    onClick={() => handleFilter("all")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:bg-yellow-700"
                >
                    All
                </button>
                <button
                    onClick={() => handleFilter("completed")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:bg-green-700"
                >
                    Completed
                </button>
                <button
                    onClick={() => handleFilter("uncompleted")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:bg-red-700"
                >
                    Uncompleted
                </button>
            </div>
            <div>
                <select
                    onChange={(e) => handleSortBy(e.target.value)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:bg-purple-700"
                >
                    <option value="createdAt">Deadline</option>
                    <option value="text">A-Z</option>
                </select>
            </div>
        </div>
        <div className="overflow-y-auto max-h-80vh">
            <ul>
                {filteredTodos.map((todo) => (
                    <li key={todo.id} className="flex items-center justify-between mb-4">
                        <div className="flex items-center w-full">
                            <div
                                onClick={() => toggleTodo(todo.id)}
                                className={`rounded-full h-8 w-8 flex items-center justify-center border-2 cursor-pointer ${
                                    todo.completed ? "bg-yellow-600 border-yellow-600" : "border-gray-400"
                                }`}
                            >
                                {todo.completed && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <div className="flex flex-col ml-4 w-full">
                                <div className={`font-semibold ${todo.completed ? "line-through text-gray-600" : "text-yellow-800"}`}>
                                    {editId === todo.id ? (
                                        <input
                                            type="text"
                                            value={editInputValue}
                                            onChange={(event) => setEditInputValue(event.target.value)}
                                            onKeyPress={(event) => handleKeyPress(event)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:border-yellow-600"
                                        />
                                    ) : (
                                        <span>{todo.text}</span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {editId === todo.id ? (
                                        <input
                                            type="datetime-local"
                                            value={editDeadline}
                                            onChange={(event) => setEditDeadline(event.target.value)}
                                            className="w-full px-4 py-1 mt-1 rounded-lg border border-gray-400 focus:outline-none focus:border-yellow-600"
                                        />
                                    ) : (
                                        <span>Deadline: {new Date(todo.deadline).toLocaleDateString()} ({calculateDaysLeft(todo.deadline)} days left)
										</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            {editId !== todo.id && (
                                <button
                                    onClick={() => handleEdit(todo.id)}
                                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                                >
                                    Edit
                                </button>
                            )}

							{editId !== todo.id && (
                                <button
                                onClick={() => deleteTodo(todo.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:bg-red-700"
                            >
                                Remove
                            </button>
                            )}	

							{editId === todo.id && (
								<button
									onClick={() => cancelEdit()}
									className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
								>
									Cancel
								</button>
							)}
                            
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
</div>


	);
}

export default TodoApp;
