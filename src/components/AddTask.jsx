import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addTask } from '../features/taskSlice';

const AddTask = () => {
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [categories, setCategories] = useState(['Shopping', 'Travelling']);
  const dispatch = useDispatch();

  const handleNewTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
      setCategory(customCategory); // Automatically set the new category
      setCustomCategory(''); // Clear the custom category input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() && category) {
      const newAddTask = {
        id: uuidv4(),
        text: newTask,
        category,
        done: false,
      };

      // Dispatch action to Redux
      dispatch(addTask(newAddTask));

      // Clear the form
      setNewTask('');
      setCategory('');
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
            value={category}
            onChange={handleCategoryChange}
            required
            className="w-full p-3 text-gray-900 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Task Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Add Custom Category"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              className="w-full p-3 text-gray-900 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={addCustomCategory}
              className="py-3 px-6 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
            >
              Add Category
            </button>
          </div>
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
