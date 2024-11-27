import React, { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText, IconButton, Checkbox, Button, Divider, Box, Tooltip, Select, MenuItem, TextField, Typography } from '@mui/material';
import { Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { deleteTask, markAsDone, moveTask, toggleShowDone, addTask } from '../features/taskSlice';

const ListTask = () => {
  const dispatch = useDispatch();
  const { items, showDone } = useSelector((state) => state.tasks);
  const [searchTask, setSearchTask] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Fuse.js configuration
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ['text', 'category'], // Fields to search
      threshold: 0.4, // Fuzzy match threshold
    });
  }, [items]);

  // Filter tasks based on visibility, status, and search query using Fuse.js
  const filteredItems = useMemo(() => {
    let result = items;

    if (searchTask) {
      result = fuse.search(searchTask).map(({ item }) => item);
    }

    return result.filter(
      (item) =>
        (showDone || !item.done) &&
        (categoryFilter === '' || item.category === categoryFilter)
    );
  }, [items, fuse, searchTask, showDone, categoryFilter]);

  const filteredCount = useMemo(() => filteredItems.length, [filteredItems]);

  const getCategoryColor = useCallback((category) => {
    const colors = [
      'bg-pink-500 text-white',
      'bg-green-500 text-white',
      'bg-yellow-500 text-white',
      'bg-red-500 text-white',
      'bg-purple-500 text-white',
      'bg-indigo-500 text-white',
      'bg-teal-500 text-white',
      'bg-orange-500 text-white',
      'bg-gray-500 text-white',
    ];

    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };

    const index = Math.abs(hashCode(category) % colors.length);

    return colors[index];
  }, []);

  // Group tasks by category
  const groupedTasks = useMemo(() => {
    return filteredItems.reduce((groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    }, {});
  }, [filteredItems]);

  // Extract unique categories from the tasks
  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map((item) => item.category));
    return Array.from(uniqueCategories);
  }, [items]);

  const handleSearchChange = (e) => setSearchTask(e.target.value);
  const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);
  const handleToggleShowDone = () => dispatch(toggleShowDone());
  const handleMarkAsDone = (id) => dispatch(markAsDone(id));
  const handleMoveTask = (id, direction, index) =>
    dispatch(moveTask({ id, direction, filteredIndex: index }));
  const handleDeleteTask = (id) => dispatch(deleteTask(id));
  const handleAddTask = (newTask) => dispatch(addTask(newTask));

  return (
    <div className="p-6 bg-gradient from-purple-600 to-indigo-600 text-black shadow-lg rounded-lg max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4 sm:mb-0">Your Tasks</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            className="w-full sm:w-48 bg-gray-100 rounded-lg"
          >
            <MenuItem value="">All Tasks</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold text-sm px-4 py-1.5 rounded-lg shadow-lg border border-indigo-400">
            {filteredCount} Tasks
          </span>
        </div>
      </div>

      <div className="mb-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTask}
          onChange={handleSearchChange}
          className="shadow-md bg-white text-black rounded-lg"
        />
      </div>

      <div className="flex flex-col max-h-[400px] overflow-y-auto mb-4">
        {categoryFilter === ''
          ? Object.keys(groupedTasks).map((category) => (
              <div key={category}>
                <Typography variant="h6" className="text-white bg-gradient-to-r from-indigo-500 to-blue-600 p-2 rounded-lg mt-4 mb-2">
                  {category}
                </Typography>
                <List>
                  {groupedTasks[category].map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem
                        className={`flex flex-col sm:flex-row items-center justify-between border-b border-gray-300 py-3 ${getCategoryColor(
                          item.category
                        )} rounded-lg mb-2`}
                      >
                        <div className="flex items-center flex-1">
                          <Checkbox
                            checked={item.done}
                            onChange={() => handleMarkAsDone(item.id)}
                            color="primary"
                            className="mr-4"
                          />
                          <ListItemText primary={item.text} className="text-white" />
                        </div>
                        <Box display="flex" className="space-x-3">
                          <Tooltip title="Move Up" arrow>
                            <IconButton
                              onClick={() => handleMoveTask(item.id, -1, index)}
                              disabled={index === 0}
                              className="text-white hover:bg-indigo-600 p-2 rounded-full transition duration-200"
                            >
                              <ArrowUpward />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Move Down" arrow>
                            <IconButton
                              onClick={() => handleMoveTask(item.id, 1, index)}
                              disabled={index === groupedTasks[category].length - 1}
                              className="text-white hover:bg-indigo-600 p-2 rounded-full transition duration-200"
                            >
                              <ArrowDownward />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton
                              onClick={() => handleDeleteTask(item.id)}
                              className="text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </div>
            ))
          : groupedTasks[categoryFilter]?.map((item, index) => (
              <React.Fragment key={item.id}>
                
                <ListItem
                  className={`flex flex-col sm:flex-row items-center justify-between border-b border-gray-300 py-3 ${getCategoryColor(
                    item.category
                  )} rounded-lg mb-2`}
                >
                  
                  <div className="flex items-center flex-1">
                    <Checkbox
                      checked={item.done}
                      onChange={() => handleMarkAsDone(item.id)}
                      color="primary"
                      className="mr-4"
                    />
                    <ListItemText primary={item.text} className="text-white" />
                  </div>
                  <Box display="flex" className="space-x-3">
                    <Tooltip title="Move Up" arrow>
                      <IconButton
                        onClick={() => handleMoveTask(item.id, -1, index)}
                        disabled={index === 0}
                        className="text-white hover:bg-indigo-600 p-2 rounded-full transition duration-200"
                      >
                        <ArrowUpward />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Move Down" arrow>
                      <IconButton
                        onClick={() => handleMoveTask(item.id, 1, index)}
                        disabled={index === groupedTasks[categoryFilter].length - 1}
                        className="text-white hover:bg-indigo-600 p-2 rounded-full transition duration-200"
                      >
                        <ArrowDownward />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        onClick={() => handleDeleteTask(item.id)}
                        className="text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
      </div>

      <Button
        onClick={handleToggleShowDone}
        variant="contained"
        color="secondary"
        className="sticky bottom-0 w-full py-2 font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
      >
        {showDone ? 'Hide Done Items' : 'Show Done Items'}
      </Button>
    </div>
  );
};

export default ListTask;
