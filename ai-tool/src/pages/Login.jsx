import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Simulate API call with a small delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 'demo_user_id',
        username: formData.username || 'demo'
      }));
      
      console.log('Login successful - Redirecting to /project');
      setMessage('✅ Login successful!');
      
      // Force a small delay to show success message before redirecting
      setTimeout(() => {
        navigate('/project');
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      setMessage('❌ An error occurred during login');
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

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundShapes: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    },
    floatingShape: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(0, 0, 0, 0.03)',
      animation: 'float 6s ease-in-out infinite'
    },
    leftPanel: {
      flex: '1',
      padding: '80px 60px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 2
    },
    logo: {
      fontSize: '3.5rem',
      fontWeight: '300',
      color: '#000',
      marginBottom: '2rem',
      letterSpacing: '-2px',
      animation: 'slideInLeft 1s ease-out'
    },
    tagline: {
      fontSize: '1.3rem',
      color: '#666',
      lineHeight: '1.6',
      maxWidth: '500px',
      animation: 'slideInLeft 1s ease-out 0.3s both'
    },
    rightPanel: {
      flex: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative',
      zIndex: 2
    },
    loginForm: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(15px)',
      borderRadius: '24px',
      padding: '50px 40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'slideInRight 1s ease-out',
      position: 'relative'
    },
    formTitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#000',
      textAlign: 'center',
      marginBottom: '2rem',
      letterSpacing: '-0.5px'
    },
    inputGroup: {
      marginBottom: '1.5rem',
      position: 'relative'
    },
    inputLabel: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: '500',
      color: '#333',
      marginBottom: '0.5rem',
      transition: 'color 0.3s ease'
    },
    inputContainer: {
      position: 'relative',
      transition: 'transform 0.3s ease'
    },
    input: {
      width: '100%',
      padding: '16px 20px',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: '#fff',
      outline: 'none',
      boxSizing: 'border-box'
    },
    passwordContainer: {
      position: 'relative'
    },
    eyeButton: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#666',
      fontSize: '1.1rem',
      transition: 'color 0.3s ease'
    },
    forgotPassword: {
      textAlign: 'right',
      marginTop: '0.5rem'
    },
    forgotLink: {
      color: '#666',
      background: 'transparent',
      border: 'none',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      textDecoration: 'none'
    },
    submitButton: {
      width: '100%',
      background: '#000',
      color: '#fff',
      border: 'none',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      margin: '2rem 0 1.5rem 0',
      position: 'relative',
      overflow: 'hidden'
    },
    googleButton: {
      width: '100%',
      background: '#fff',
      color: '#333',
      border: '2px solid #e9ecef',
      padding: '14px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '1.5rem'
    },
    signupText: {
      textAlign: 'center',
      color: '#666',
      fontSize: '0.9rem'
    },
    signupLink: {
      color: '#000',
      background: 'transparent',
      border: 'none',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'opacity 0.3s ease',
      textDecoration: 'none'
    },
    message: {
      padding: '12px',
      borderRadius: '8px',
      marginTop: '1rem',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontWeight: '500',
      animation: 'fadeIn 0.3s ease'
    },
    successMessage: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    errorMessage: {
      background: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },


  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
          
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1); }
            70% { box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
          }
          
          .input-focused {
            border-color: #000 !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          
          .input-container-focused {
            transform: translateY(-5px);
          }
          
          .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
          }
          
          .submit-button:active {
            transform: translateY(0);
          }
          
          .submit-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .submit-button:hover::before {
            left: 100%;
          }
          
          .google-button:hover {
            border-color: #000;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          
          .forgot-link:hover {
            color: #000;
          }
          
          .signup-link:hover {
            opacity: 0.7;
          }
          
          .eye-button:hover {
            color: #000;
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          @media (max-width: 768px) {
            .container {
              flex-direction: column;
            }
            .left-panel {
              padding: 40px 30px;
              text-align: center;
            }
            .logo {
              font-size: 2.5rem;
            }
            .tagline {
              font-size: 1.1rem;
            }
            .right-panel {
              padding: 20px;
            }
            .login-form {
              padding: 40px 30px;
            }
          }
        `}
      </style>

      <div style={styles.container} className="container">
        {/* Floating Background Shapes */}
        <div style={styles.backgroundShapes}>
          <div
            style={{
              ...styles.floatingShape,
              width: '100px',
              height: '100px',
              top: '20%',
              left: '10%',
              animationDelay: '0s'
            }}
          />
          <div
            style={{
              ...styles.floatingShape,
              width: '150px',
              height: '150px',
              top: '60%',
              left: '85%',
              animationDelay: '2s'
            }}
          />
          <div
            style={{
              ...styles.floatingShape,
              width: '80px',
              height: '80px',
              top: '80%',
              left: '15%',
              animationDelay: '4s'
            }}
          />
        </div>

        {/* Left Panel */}
        <div style={styles.leftPanel} className="left-panel">
          <h1 style={styles.logo}>Annotateai</h1>
          <p style={styles.tagline}>
            Our intelligent annotation tool assists you at every step, making your data prep smarter,
            faster, and easier.
          </p>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel} className="right-panel">
          <div style={styles.loginForm} className="login-form">
            <h2 style={styles.formTitle}>Sign in to your account</h2>

            {/* Username Input */}
            <div style={styles.inputGroup}>
              <div
                style={{
                  ...styles.inputLabel,
                  color: focusedInput === 'username' ? '#000' : '#333'
                }}
              >
                Username
              </div>
              <div
                style={{
                  ...styles.inputContainer,
                  transform: focusedInput === 'username' ? 'translateY(-5px)' : 'translateY(0)'
                }}
                className={focusedInput === 'username' ? 'input-container-focused' : ''}
              >
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  onFocus={() => handleInputFocus('username')}
                  onBlur={handleInputBlur}
                  style={styles.input}
                  className={focusedInput === 'username' ? 'input-focused' : ''}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <div
                style={{
                  ...styles.inputLabel,
                  color: focusedInput === 'password' ? '#000' : '#333'
                }}
              >
                Password
              </div>
              <div
                style={{
                  ...styles.inputContainer,
                  transform: focusedInput === 'password' ? 'translateY(-5px)' : 'translateY(0)'
                }}
                className={focusedInput === 'password' ? 'input-container-focused' : ''}
              >
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={handleInputBlur}
                    style={styles.input}
                    className={focusedInput === 'password' ? 'input-focused' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    className="eye-button"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div style={styles.forgotPassword}>
                <button
                  type="button"
                  style={styles.forgotLink}
                  className="forgot-link"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              style={styles.submitButton}

            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              style={styles.googleButton}
              className="google-button"
              onClick={() => navigate('/SignUp')}  // Updated to redirect to SignUp page
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div style={styles.signupText}>
              Don't have an account?{' '}
              <button
                type="button"
                style={styles.signupLink}
                className="signup-link"
                onClick={() => navigate('/SignUp')} //Added navigation to SignUp page
              >
                Sign up
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div
                style={{
                  ...styles.message,
                  ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;