import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../AxiosMethods';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationAPI.getNotifications();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationAPI.getNotifications();
      return res.data.unreadCount;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationAPI.markAllAsRead();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload || 0;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notif = state.notifications.find((n) => n.id === id);
        if (notif) {
          notif.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.read = true));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const id = action.payload;
        const notif = state.notifications.find((n) => n.id === id);
        if (notif && !notif.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((n) => n.id !== id);
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
