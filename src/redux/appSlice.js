import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  workspaces: [],
  currentWorkspace: null,
  taskLists: [],
  tasks: {},
  notifications: [],
  loading: false,
  error: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
    setTaskLists: (state, action) => {
      state.taskLists = action.payload;
    },
    addTaskList: (state, action) => {
      state.taskLists.push(action.payload);
    },
    setTasks: (state, action) => {
      const { listId, tasks } = action.payload;
      state.tasks[listId] = tasks;
    },
    addTask: (state, action) => {
      const { listId, task } = action.payload;
      if (!state.tasks[listId]) {
        state.tasks[listId] = [];
      }
      state.tasks[listId].push(task);
    },
    updateTask: (state, action) => {
      const { listId, taskId, updates } = action.payload;
      if (state.tasks[listId]) {
        const taskIndex = state.tasks[listId].findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[listId][taskIndex] = {
            ...state.tasks[listId][taskIndex],
            ...updates
          };
        }
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationRead: (state, action) => {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(
        notification => notification.id === notificationId
      );
      if (notificationIndex !== -1) {
        state.notifications[notificationIndex].read = true;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setUser,
  setWorkspaces,
  addWorkspace,
  setCurrentWorkspace,
  setTaskLists,
  addTaskList,
  setTasks,
  addTask,
  updateTask,
  setNotifications,
  addNotification,
  markNotificationRead,
  setLoading,
  setError,
  clearError
} = appSlice.actions;

export default appSlice.reducer;
