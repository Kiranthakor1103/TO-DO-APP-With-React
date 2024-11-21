import React, { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText, IconButton, Checkbox, Button, Divider, Box, Tooltip, Select, MenuItem, TextField } from '@mui/material';
import { Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { deleteTask, markAsDone, moveTask, toggleShowDone } from '../features/taskSlice';

const ListTask = () => {
  const dispatch = useDispatch();
  const { items, showDone } = useSelector((state) => state.tasks);
  const [searchTask, setSearchTask] = useState('');
  const [taskCatFilter, setTaskCatFilter] = useState('');

  // Fuse.js configuration
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ['text', 'taskType'], // Fields to search
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
        (taskCatFilter === '' || item.taskType === taskCatFilter)
    );
  }, [items, fuse, searchTask, showDone, taskCatFilter]);

  const filteredCount = useMemo(() => filteredItems.length, [filteredItems]);

  const getTaskCatColor = useCallback((taskType) => {
    switch (taskType) {
      case 'Office': return 'bg-pink-500 text-white';
      case 'Shopping': return 'bg-green-500 text-white';
      case 'Travelling': return 'bg-yellow-500 text-white';
      case 'Grocery': return 'bg-red-500 text-white';
      case 'Bills': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }, []);

  const handleSearchChange = (e) => setSearchTask(e.target.value);
  const handleTaskCatFilterChange = (e) => setTaskCatFilter(e.target.value);
  const handleToggleShowDone = () => dispatch(toggleShowDone());
  const handleMarkAsDone = (id) => dispatch(markAsDone(id));
  const handleMoveTask = (id, direction, index) => dispatch(moveTask({ id, direction, filteredIndex: index }));
  const handleDeleteTask = (id) => dispatch(deleteTask(id));

  return (
    <div className="p-6 bg-gradient from-purple-600 to-indigo-600 text-black shadow-lg rounded-lg max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4 sm:mb-0">Your Tasks</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Select
            value={taskCatFilter}
            onChange={handleTaskCatFilterChange}
            className="w-full sm:w-48 bg-gray-100 rounded-lg"
          >
            <MenuItem value="">All Tasks</MenuItem>
            <MenuItem value="Office">Office</MenuItem>
            <MenuItem value="Shopping">Shopping</MenuItem>
            <MenuItem value="Travelling">Travelling</MenuItem>
            <MenuItem value="Grocery">Grocery</MenuItem>
            <MenuItem value="Bills">Bills</MenuItem>
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
          // InputProps={{
          //   style: {
          //     backgroundColor: 'white',
          //     color: 'black',
          //   },
          // }}
        />
      </div>

      <div className="flex flex-col max-h-[400px] overflow-y-auto mb-4">
        <List>
          {filteredItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem className={`flex flex-col sm:flex-row items-center justify-between border-b border-gray-300 py-3 ${getTaskCatColor(item.taskType)} rounded-lg mb-2`}>
                <div className="flex items-center flex-1">
                  <Checkbox
                    checked={item.done}
                    onChange={() => handleMarkAsDone(item.id)}
                    color="primary"
                    className="mr-4"
                  />
                  <ListItemText
                    primary={item.text}
                    secondary={`Category: ${item.taskType}`}
                    className="text-white"
                  />
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
                      disabled={index === filteredItems.length - 1}
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
