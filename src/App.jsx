import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import AuthGuard from './auth/AuthGuard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={
          <AuthGuard required={false}>
            <Register />
          </AuthGuard>
        } />
        <Route path="/login" element={
          <AuthGuard required={false}>
            <Login />
          </AuthGuard>
        } />
        <Route
          path="/dashboard"
          element={
            <AuthGuard required={true}>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route path="/" element={
          <AuthGuard required={false}>
            <Login />
          </AuthGuard>
        } />
      </Routes>
       <ToastContainer
        position='top-right'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'/>
    </BrowserRouter>
  );
}

export default App;