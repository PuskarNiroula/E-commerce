
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import BusinessSignup from './Authentication/BusinessAuthentication.jsx'
import Login from './Authentication/login.jsx'
import AdminLayout from './Admin/AdminLayout.jsx'
import AdminDashboard from './Admin/AdminPages/AdminDashboard.jsx'
import ExtendedSubscription from './Admin/AdminPages/ExtendSubscription.jsx'
import { ToastContainer } from "react-toastify";


import './Admin/css/AdminSidebar.css'
import './index.css'

function Home() {
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">E-commerce</div>

        <nav className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <button
            className="signup-btn"
            onClick={() => setShowSignup(true)}
          >
            Sign Up
          </button>
        </nav>
      </header>

      <main className="hero-section">

        <div className="hero-content">
          <h1>Welcome to E-commerce</h1>

          <p>
            Discover amazing products and enjoy a simple, fast, and secure
            shopping experience.
          </p>

          <button className="shop-btn">
            Start Shopping
          </button>
        </div>
      </main>

      {showSignup && (
        <div
          className="modal-overlay"
          onClick={() => setShowSignup(false)}
        >
          <div
            className="signup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setShowSignup(false)}
            >
              ×
            </button>

            <h2>Create an Account</h2>

            <p>Choose how you want to use E-commerce</p>

            <div className="account-options">
              <Link
                to="/signup/customer"
                className="account-card"
                onClick={() => setShowSignup(false)}
              >
                <span className="account-icon">👤</span>

                <span className="account-title">
                  Customer
                </span>

                <span className="account-description">
                  Shop products and place orders
                </span>
              </Link>

              <Link
                to="/signup/business"
                className="account-card"
                onClick={() => setShowSignup(false)}
              >
                <span className="account-icon">🏢</span>

                <span className="account-title">
                  Business
                </span>

                <span className="account-description">
                  Sell products and manage your store
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Signup() {
  return (
    <div className="signup-page">
      <h1>Create an Account</h1>

      <p>Choose how you want to use E-commerce</p>

      <div className="account-options">
        <Link to="/signup/customer" className="account-card">
          <span className="account-icon">👤</span>

          <span className="account-title">
            Customer
          </span>

          <span className="account-description">
            Shop products and place orders
          </span>
        </Link>

        <Link to="/signup/business" className="account-card">
          <span className="account-icon">🏢</span>

          <span className="account-title">
            Business
          </span>

          <span className="account-description">
            Sell products and manage your store
          </span>
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/signup/business"
          element={<BusinessSignup />}
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='/admin/subscription/renew' element={<ExtendedSubscription />} />
          {/*<Route path="products" element={<Products />} />*/}
          {/*<Route path="orders" element={<Orders />} />*/}
          {/*<Route path="users" element={<Users />} />*/}
          {/*<Route path="settings" element={<Settings />} />*/}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
