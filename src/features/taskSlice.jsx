import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  showDone: false,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.items.unshift(action.payload);
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    markAsDone: (state, action) => {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) task.done = !task.done;
    },
    moveTask: (state, action) => {
      const { id, direction } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < state.items.length) {  
          const [removed] = state.items.splice(index, 1); 
          state.items.splice(newIndex, 0, removed);
        }
      }   
    },
    toggleShowDone: (state) => {
      state.showDone = !state.showDone;
    },
  },
});

export const { addTask, deleteTask, markAsDone, moveTask, toggleShowDone } =
  taskSlice.actions;

export default taskSlice.reducer;
