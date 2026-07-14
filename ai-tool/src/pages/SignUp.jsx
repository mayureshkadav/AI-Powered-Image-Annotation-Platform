import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import { apiUrl } from '../api';

const SignUp = () => {
  const navigate = useNavigate();
 
  // const navigate = (path) => {
  //   console.log(`Navigating to: ${path}`);
  //   // In production: useNavigate() from react-router-dom
  // };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setMessage("❌ First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setMessage("❌ Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setMessage("❌ Email is required");
      return false;
    }
    if (formData.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return false;
    }
    if (!acceptTerms) {
      setMessage("❌ Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch(apiUrl('/api/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Account created successfully! Please check your email for verification.");
        console.log('Navigating to: /login');
        navigate('/Login');

      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Server error - please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
  };

  return (
    <div className="signup-container">
      {/* Background shapes */}
      <div className="background-shapes">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
      </div>

      {/* Left Panel */}
      <div className="left-panel">
        <h1 className="logo">Annotateai</h1>
        <p className="tagline">
          Join thousands of users who are making their data annotation workflow smarter, faster, and more efficient with our AI-powered tools.
        </p>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="signup-form">
          <h2 className="form-title">Create your account</h2>

          <div className="input-row">
            {['firstName', 'lastName'].map((name) => (
              <div className="input-group" key={name}>
                <label className={`input-label ${focusedInput === name ? 'focused' : ''}`}>
                  {name === 'firstName' ? 'First Name' : 'Last Name'}
                </label>
                <div className={`input-container ${focusedInput === name ? 'focused' : ''}`}>
                  <input
                    type="text"
                    name={name}
                    placeholder={name === 'firstName' ? 'First name' : 'Last name'}
                    value={formData[name]}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(name)}
                    onBlur={handleInputBlur}
                    className={`input ${focusedInput === name ? 'focused' : ''}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Email Input */}
          <div className="input-group">
            <label className={`input-label ${focusedInput === 'email' ? 'focused' : ''}`}>
              Email
            </label>
            <div className={`input-container ${focusedInput === 'email' ? 'focused' : ''}`}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => handleInputFocus('email')}
                onBlur={handleInputBlur}
                className={`input ${focusedInput === 'email' ? 'focused' : ''}`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label className={`input-label ${focusedInput === 'password' ? 'focused' : ''}`}>
              Password
            </label>
            <div className={`input-container ${focusedInput === 'password' ? 'focused' : ''}`}>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create password (6+ characters)"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={handleInputBlur}
                  className={`input ${focusedInput === 'password' ? 'focused' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-button"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <label className={`input-label ${focusedInput === 'confirmPassword' ? 'focused' : ''}`}>
              Confirm Password
            </label>
            <div className={`input-container ${focusedInput === 'confirmPassword' ? 'focused' : ''}`}>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('confirmPassword')}
                  onBlur={handleInputBlur}
                  className={`input ${focusedInput === 'confirmPassword' ? 'focused' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="eye-button"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="checkbox"
            />
            <label htmlFor="terms" className="checkbox-label">
              I agree to the <button className="terms-link">Terms of Service</button> and <button className="terms-link">Privacy Policy</button>
            </label>
          </div>

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="loading-spinner" />
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Google Button */}
          <button type="button" className="google-button">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

           <div className="login-text">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/Login')} className="login-link">
              Sign in
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success-message' : 'error-message'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
