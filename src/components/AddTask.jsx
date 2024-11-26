import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addTask } from '../features/taskSlice'; 

const AddTask = () => {
  const [newTask, setNewTask] = useState('');
  const [taskType, setTaskType] = useState('');
  const dispatch = useDispatch();

  const handleNewTaskChange = (e) => {
    setNewTask(e.target.value);
  };
  
  const handleTaskTypeChange = (e) => {
    setTaskType(e.target.value);
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newAddTask = {
        id: uuidv4(),
        text: newTask,
        taskType,
        done: false,
      };
      dispatch(addTask(newAddTask));
      setNewTask(''); // clear the task field 
      setTaskType(''); // clear the task type
    }
  };

  return (
    <div className="max-w-2xl sm:max-w-3xl mx-auto p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg rounded-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center mb-4">Add New Task</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask}
            onChange={handleNewTaskChange}
            required
            className="w-full p-3 text-gray-900 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={taskType}
            onChange={handleTaskTypeChange}
            required
            className="w-full p-3 text-gray-900 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Task Category</option>
            <option value="Office">Office</option>
            <option value="Shopping">Shopping</option>
            <option value="Travelling">Travelling</option>
            <option value="Grocery">Grocery</option>
            <option value="Bills">Bills</option>    
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
