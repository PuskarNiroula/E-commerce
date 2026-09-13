import { useEffect, useRef, useState } from 'react'
import './BusinessAuthentication.css'
import  api  from "../api.js";

const initialFormData = {
  storeName: '',
  address: '',
  description: '',
  logo: null,
  storePhone: '',
  storeEmail: '',
  fullName: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  agreeToTerms: false,
}

function UploadIcon() {
  return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15V4" />
        <path d="M7.5 8.5 12 4l4.5 4.5" />
        <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
      </svg>
  )
}

function CheckIcon() {
  return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 13 4 4L19 7" />
      </svg>
  )
}

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

function BusinessSignup() {
  const [formData, setFormData] = useState(initialFormData)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [logoPreview, setLogoPreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }
    }
  }, [logoPreview])

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === 'file') {
      const file = files[0] || null

      if (!file) {
        return
      }

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ]

      if (!allowedTypes.includes(file.type)) {
        setError('Logo must be a JPG, JPEG, PNG, or WEBP image.')
        e.target.value = ''
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Logo must not be larger than 2 MB.')
        e.target.value = ''
        return
      }

      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
      }

      setLogoPreview(URL.createObjectURL(file))

      setFormData((prev) => ({
        ...prev,
        logo: file,
      }))

      setError('')
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setError('')
  }

  const handleRemoveLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview)
    }

    setLogoPreview(null)

    setFormData((prev) => ({
      ...prev,
      logo: null,
    }))

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleNext = () => {
    if (!formData.storeName.trim()) {
      setError('Store name is required.')
      return
    }

    if (!formData.address.trim()) {
      setError('Store address is required.')
      return
    }

    if (!formData.storePhone.trim()) {
      setError('Store phone is required.')
      return
    }

    if (!formData.storeEmail.trim()) {
      setError('Store email is required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.storeEmail)) {
      setError('Please enter a valid store email.')
      return
    }

    setError('')
    setStep(2)
  }

  const handleBack = () => {
    setError('')
    setStep(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fullName.trim()) {
      setError('Full name is required.')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email.')
      return
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match.')
      return
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the Seller Terms and Merchant Agreement.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const payload = new FormData()

      payload.append('fullName', formData.fullName)
      payload.append('phone', formData.phone)
      payload.append('email', formData.email)
      payload.append('password', formData.password)
      payload.append('password_confirmation', formData.password_confirmation)

      payload.append('storeName', formData.storeName)
      payload.append('address', formData.address)
      payload.append('storePhone', formData.storePhone)
      payload.append('storeEmail', formData.storeEmail)
      payload.append('description', formData.description)

      if (formData.logo) {
        payload.append('logo', formData.logo)
      }

      const response = api.post('/api/business/register', {
        method: 'POST',
        body: payload,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0]?.[0]
          setError(firstError || 'Please check the form and try again.')
        } else {
          setError(data.message || 'Something went wrong. Please try again.')
        }

        return
      }

      console.log(data)

    } catch (err) {
      setError('Unable to create your business account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const passwordsMismatch =
      formData.password_confirmation.length > 0 &&
      formData.password !== formData.password_confirmation

  const passwordsMatch =
      formData.password_confirmation.length > 0 &&
      formData.password === formData.password_confirmation

  return (
      <div className="business-signup">
        <div className="signup-container">

          <div className="signup-header">
            <h1>Set up your business account</h1>
            <p>Add your store details and create your account to start selling.</p>
          </div>

          <div className="stepper">
            <div
                className={`step ${
                    step === 1 ? 'is-active' : ''
                } ${step > 1 ? 'is-complete' : ''}`}
            >
            <span className="step-marker">
              {step > 1 ? <CheckIcon /> : '1'}
            </span>

              <span className="step-label">
              Store details
            </span>
            </div>

            <div
                className={`step-line ${
                    step > 1 ? 'is-complete' : ''
                }`}
            />

            <div
                className={`step ${
                    step === 2 ? 'is-active' : ''
                }`}
            >
            <span className="step-marker">
              2
            </span>

              <span className="step-label">
              Your account
            </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {step === 1 && (
                <div className="form-step">

                  <div className="form-group">
                    <label htmlFor="storeName">
                      Store name
                    </label>

                    <input
                        id="storeName"
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        placeholder="e.g. Northfield Home Goods"
                        autoComplete="organization"
                        maxLength={255}
                        required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      Store address
                    </label>

                    <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street, city, postal code"
                        autoComplete="street-address"
                        maxLength={255}
                        required
                    />
                  </div>

                  <div className="form-row">

                    <div className="form-group">
                      <label htmlFor="storePhone">
                        Store phone
                      </label>

                      <input
                          id="storePhone"
                          type="tel"
                          name="storePhone"
                          value={formData.storePhone}
                          onChange={handleChange}
                          placeholder="Store phone number"
                          autoComplete="tel"
                          maxLength={20}
                          required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="storeEmail">
                        Store email
                      </label>

                      <input
                          id="storeEmail"
                          type="email"
                          name="storeEmail"
                          value={formData.storeEmail}
                          onChange={handleChange}
                          placeholder="store@company.com"
                          autoComplete="email"
                          maxLength={255}
                          required
                      />
                    </div>

                  </div>

                  <div className="form-group">
                    <label htmlFor="description">
                      Store description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell customers what you sell and what makes your store worth a visit."
                        rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Store logo
                    </label>

                    <div
                        className="logo-dropzone"
                        onClick={() => fileInputRef.current?.click()}
                    >

                      {logoPreview ? (
                          <div className="logo-preview">

                            <img
                                src={logoPreview}
                                alt="Store logo preview"
                            />

                            <div className="logo-preview-info">

                        <span>
                          {formData.logo?.name}
                        </span>

                              <button
                                  type="button"
                                  className="logo-remove"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveLogo()
                                  }}
                              >
                                Remove
                              </button>

                            </div>

                          </div>
                      ) : (
                          <div className="logo-placeholder">

                            <UploadIcon />

                            <span>
                        Click to upload your store logo
                      </span>

                            <span className="logo-hint">
                        JPG, JPEG, PNG or WEBP, up to 2 MB
                      </span>

                          </div>
                      )}

                      <input
                          ref={fileInputRef}
                          type="file"
                          name="logo"
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          onChange={handleChange}
                          hidden
                      />

                    </div>
                  </div>

                  {error && (
                      <p className="form-error">
                        {error}
                      </p>
                  )}

                  <div className="form-actions">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleNext}
                    >
                      Continue
                    </button>
                  </div>

                </div>
            )}

            {step === 2 && (
                <div className="form-step">

                  <div className="form-group">
                    <label htmlFor="fullName">
                      Full name
                    </label>

                    <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        maxLength={255}
                        required
                    />
                  </div>

                  <div className="form-row">

                    <div className="form-group">
                      <label htmlFor="email">
                        Email
                      </label>

                      <input
                          id="email"
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

                    <div className="form-group">
                      <label htmlFor="phone">
                        Phone number
                      </label>

                      <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          autoComplete="tel"
                          maxLength={20}
                          required
                      />
                    </div>

                  </div>

                  <div className="form-row">

                    <div className="form-group">
                      <label htmlFor="password">
                        Password
                      </label>

                      <div className="password-field">

                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 8 characters"
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            aria-label={
                              showPassword
                                  ? 'Hide password'
                                  : 'Show password'
                            }
                        >
                          {showPassword ? (
                              <EyeOffIcon />
                          ) : (
                              <EyeIcon />
                          )}
                        </button>

                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="password_confirmation">
                        Confirm password
                      </label>

                      <div className="password-field">

                        <input
                            id="password_confirmation"
                            type={
                              showConfirmPassword
                                  ? 'text'
                                  : 'password'
                            }
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                            }
                            aria-label={
                              showConfirmPassword
                                  ? 'Hide password'
                                  : 'Show password'
                            }
                        >
                          {showConfirmPassword ? (
                              <EyeOffIcon />
                          ) : (
                              <EyeIcon />
                          )}
                        </button>

                      </div>

                      {passwordsMismatch && (
                          <span className="field-hint field-hint-error">
                      Passwords don't match
                    </span>
                      )}

                      {passwordsMatch && (
                          <span className="field-hint field-hint-success">
                      Passwords match
                    </span>
                      )}

                    </div>

                  </div>

                  <label className="checkbox-field">

                    <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                    />

                    <span>
                  I agree to the <strong>Seller Terms</strong> and{' '}
                      <strong>Merchant Agreement</strong>.
                </span>

                  </label>

                  {error && (
                      <p className="form-error">
                        {error}
                      </p>
                  )}

                  <div className="form-actions form-actions-split">

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleBack}
                        disabled={isSubmitting}
                    >
                      Back
                    </button>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSubmitting}
                    >
                      {isSubmitting
                          ? 'Creating account...'
                          : 'Create business account'}
                    </button>

                  </div>

                </div>
            )}

          </form>
        </div>
      </div>
  )
}

export default BusinessSignup
