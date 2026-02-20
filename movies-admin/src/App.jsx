import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UserList from './pages/UserList';
import NewUser from './pages/NewUser';
import UserEdit from './pages/UserEdit';
import MovieList from './pages/MovieList';
import NewMovie from './pages/NewMovie';
import MovieEdit from './pages/MovieEdit';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected Admin Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <AdminLayout>
                <UserList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/users/new" element={
            <ProtectedRoute>
              <AdminLayout>
                <NewUser />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/users/edit/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <UserEdit />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/movies" element={
            <ProtectedRoute>
              <AdminLayout>
                <MovieList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/movies/new" element={
            <ProtectedRoute>
              <AdminLayout>
                <NewMovie />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/movies/edit/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <MovieEdit />
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;
