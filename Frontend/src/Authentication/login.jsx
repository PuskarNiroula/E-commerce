
import { useState } from 'react'
import './Login.css'
import api from '../api.js'

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a15.3 15.3 0 0 1-3.4 4.3" />
      <path d="M6.6 6.6C3.9 8.3 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email.trim()) {
      setError('Email is required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!formData.password) {
      setError('Password is required.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const response = await api.post('/login', {
        email: formData.email.trim(),
        password: formData.password,
      })

        if(response.data.data.user.role === 'admin'){
            window.location.href = '/admin';
        }
    } catch (err) {
      const errors = err.response?.data?.errors
      const firstError = errors
        ? Object.values(errors)[0]?.[0]
        : null

      setError(
        firstError ||
        err.response?.data?.message ||
        'Unable to sign in. Please check your credentials and try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="business-login">
      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-mark">B</div>
          <span>Business Portal</span>
        </div>

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage your store and grow your business.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="login-email">Email address</label>

            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              autoComplete="email"
              maxLength={255}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password">Password</label>

            <div className="login-password-field">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="login-footer">
          <span>Secure access to your business account</span>
        </div>
      </div>
    </div>
  )
}

export default Login
