import Login from './components/Login'
import './bootstrap.min.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Signup from './components/Signup'
import ProductList from './components/ProductList'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Cart from './components/Cart'
import NavBar from './components/NavBar'
import UserProfile from './components/UserProfile'

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

        </Routes>
      
      </BrowserRouter>
       <ToastContainer />
    </>
  )
}

export default App
