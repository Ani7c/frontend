import Login from './components/Login.jsx'
import './bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Signup from './components/Signup.jsx'
import ProductList from './components/ProductList.jsx'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Cart from './components/Cart.jsx'
import NavBar from './components/NavBar.jsx'
import UserProfile from './components/UserProfile.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

        </Routes>
      
      </BrowserRouter>
       <ToastContainer />
    </>
  )
}

export default App
