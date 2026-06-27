import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const Register = () => {
  const user = useStore((state) => state.user);
  const categories = useStore((state) => state.categories);
  const setUser = useStore((state) => state.setUser);
  const registeredUsers = useStore((state) => state.registeredUsers);
  const registerUser = useStore((state) => state.registerUser);
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState("signup"); // 'signup' or 'signin'
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setLoginTouched] = useState({});
  const [generalSuccessMessage, setGeneralSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    mobile: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const isRegistered = user && user.name && user.username && user.email && user.mobile;

  // Auto redirect if already registered
  useEffect(() => {
    if (isRegistered) {
      if (categories.length >= 3) {
        navigate("/dashboard");
      } else {
        navigate("/categories");
      }
    }
  }, [isRegistered, categories, navigate]);

  // Debounced username availability simulation (behave like real-time db check)
  useEffect(() => {
    if (!formData.username.trim() || errors.username) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    setUsernameAvailable(null);
    const delayDebounce = setTimeout(() => {
      setCheckingUsername(false);
      setUsernameAvailable(true);
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [formData.username, errors.username]);

  const validateField = (field, value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    if (field === "name") {
      if (!value.trim()) return "Name field cannot be left blank.";
      if (!/^[A-Za-z\s]+$/.test(value)) return "Name must only contain alphabetical characters.";
    }
    
    if (field === "username") {
      if (!value.trim()) return "Username field cannot be left blank.";
      if (/\s/.test(value)) return "Username cannot contain spaces.";
      if (!/^[a-zA-Z0-9]+$/.test(value)) return "Username must be alphanumeric.";
    }
    
    if (field === "email") {
      if (!value.trim()) return "Email field cannot be left blank.";
      if (!emailPattern.test(value)) return "Please input a valid email formatting schema.";
    }
    
    if (field === "password") {
      if (!value) return "Password field cannot be left blank.";
      if (value.length < 6) return "Password must encompass at least 6 characters.";
    }
    
    if (field === "mobile") {
      if (!value.trim()) return "Mobile field cannot be left blank.";
      if (!phonePattern.test(value)) return "Mobile field must encompass exactly 10 digital characters.";
    }

    if (field === "agreeToTerms") {
      if (!value) return "You must agree to share your registration details.";
    }

    return null;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = () => {
    const tempErrors = {};
    const touchedAll = {};

    Object.keys(formData).forEach((field) => {
      touchedAll[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        tempErrors[field] = error;
      }
    });

    setTouched(touchedAll);
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    if (validateForm()) {
      // Check if username or email is already taken
      const usernameExists = registeredUsers.some(
        (u) => u.username.toLowerCase() === formData.username.toLowerCase()
      );
      const emailExists = registeredUsers.some(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (usernameExists) {
        setErrors((prev) => ({ ...prev, username: "Username is already taken." }));
        return;
      }
      if (emailExists) {
        setErrors((prev) => ({ ...prev, email: "Email is already registered." }));
        return;
      }

      setIsSubmitting(true);
      setSubmitMessage("Connecting to security gateway...");
      setTimeout(() => {
        setSubmitMessage("Encrypting profile credentials...");
        setTimeout(() => {
          setSubmitMessage("Saving account profile...");
          setTimeout(() => {
            const newUser = {
              name: formData.name,
              username: formData.username,
              email: formData.email,
              password: formData.password,
              mobile: formData.mobile,
            };
            registerUser(newUser);
            setIsSubmitting(false);
            
            // Pre-fill sign in details
            setLoginData({
              email: formData.email,
              password: formData.password,
            });
            
            setGeneralSuccessMessage("Registration successful! Please sign in with your credentials.");
            setAuthMode("signin");
          }, 800);
        }, 1000);
      }, 800);
    }
  };

  const validateLoginField = (field, value) => {
    if (field === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return "Email is required.";
      if (!emailPattern.test(value)) return "Please input a valid email formatting schema.";
    }
    if (field === "password") {
      if (!value) return "Password is required.";
    }
    return null;
  };

  const handleLoginFieldChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (loginTouched[field]) {
      const error = validateLoginField(field, value);
      setLoginErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleLoginBlur = (field) => {
    setLoginTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateLoginField(field, loginData[field]);
    setLoginErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateLoginForm = () => {
    const tempErrors = {};
    const touchedAll = {};

    Object.keys(loginData).forEach((field) => {
      touchedAll[field] = true;
      const error = validateLoginField(field, loginData[field]);
      if (error) {
        tempErrors[field] = error;
      }
    });

    setLoginTouched(touchedAll);
    setLoginErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLoginSubmission = (event) => {
    event.preventDefault();
    if (validateLoginForm()) {
      setIsSubmitting(true);
      setSubmitMessage("Verifying profile credentials...");
      setTimeout(() => {
        const matchedUser = registeredUsers.find(
          (u) =>
            u.email.toLowerCase() === loginData.email.toLowerCase() &&
            u.password === loginData.password
        );

        if (matchedUser) {
          setSubmitMessage("Initializing session state...");
          setTimeout(() => {
            setUser(matchedUser);
            setIsSubmitting(false);
          }, 800);
        } else {
          setIsSubmitting(false);
          setLoginErrors({
            general: "Invalid email address or password. Please check your credentials.",
          });
        }
      }, 1000);
    }
  };

  const getInputClass = (field) => {
    if (!touched[field]) return "form-input";
    return errors[field] ? "form-input touched invalid" : "form-input touched valid";
  };

  const getLoginInputClass = (field) => {
    if (!loginTouched[field]) return "form-input";
    return loginErrors[field] ? "form-input touched invalid" : "form-input touched valid";
  };

  return (
    <div className="register-page-container animate-fade-in">
      <div className="unified-auth-card">
        {/* Left Side: Brand Info & Preview Widgets */}
        <div className="auth-card-info">
          <div className="art-overlay"></div>
          
          <div className="art-content">
            <h1 className="art-title">Super App</h1>
            <p className="art-subtitle">
              Organize your digital life, check weather, read news, and discover new cinema — all in one premium hub.
            </p>
            
            {/* 2x2 Mockup Widgets Grid */}
            <div className="preview-widgets-grid animate-slide-up">
              {/* Weather Widget */}
              <div className="preview-widget-card">
                <div className="preview-widget-header">
                  <div className="preview-widget-icon weather">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  </div>
                  <span className="preview-widget-title">Weather</span>
                </div>
                <div className="preview-widget-body">24°C</div>
                <div className="preview-widget-footer">Sunny in New York</div>
              </div>

              {/* News Widget */}
              <div className="preview-widget-card">
                <div className="preview-widget-header">
                  <div className="preview-widget-icon news">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <span className="preview-widget-title">News Feed</span>
                </div>
                <div className="preview-widget-body">Top Stories</div>
                <div className="preview-widget-footer">Curated global briefings</div>
              </div>

              {/* Movies Widget */}
              <div className="preview-widget-card">
                <div className="preview-widget-header">
                  <div className="preview-widget-icon movies">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="preview-widget-title">Cinema</span>
                </div>
                <div className="preview-widget-body">Trending</div>
                <div className="preview-widget-footer">Personal recommendations</div>
              </div>

              {/* Notes Widget */}
              <div className="preview-widget-card">
                <div className="preview-widget-header">
                  <div className="preview-widget-icon notes">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span className="preview-widget-title">Quick Notes</span>
                </div>
                <div className="preview-widget-body">Organized</div>
                <div className="preview-widget-footer">Saved instantly to storage</div>
              </div>
            </div>

            <div className="art-floating-grid">
              <div className="floating-bubble bubble-1"></div>
              <div className="floating-bubble bubble-2"></div>
            </div>
          </div>

          <div className="art-footer-tag">
            Discover your next favorite movies
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="auth-card-form">
          <div className="form-header">
            <h2>{authMode === "signup" ? "Create an account" : "Sign In to Super App"}</h2>
            <p style={{ display: "inline-flex", gap: "0.35rem", flexWrap: "wrap" }}>
              <span>{authMode === "signup" ? "Already have an account?" : "New to Super App?"}</span>
              <span 
                onClick={() => {
                  setAuthMode(authMode === "signup" ? "signin" : "signup");
                  setGeneralSuccessMessage("");
                  setErrors({});
                  setTouched({});
                  setLoginErrors({});
                  setLoginTouched({});
                }} 
                style={{ 
                  color: "var(--color-primary)", 
                  cursor: "pointer", 
                  textDecoration: "underline",
                  fontWeight: "600"
                }}
              >
                {authMode === "signup" ? "Sign In" : "Register here"}
              </span>
            </p>
          </div>
          
          {generalSuccessMessage && (
            <div style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
              color: "#10b981",
              padding: "0.75rem 1rem",
              borderRadius: "var(--border-radius-sm)",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
              fontWeight: "500",
              animation: "scaleIn 0.2s ease-out"
            }}>
              {generalSuccessMessage}
            </div>
          )}

          {authMode === "signup" ? (
            <form onSubmit={handleFormSubmission} className="form-container">
              <div className="form-group">
                <label className="form-label">Name</label>
                <div className="form-input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    className={`${getInputClass("name")} form-input-with-icon`}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                  />
                </div>
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="form-input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    type="text"
                    className={`${getInputClass("username")} form-input-with-icon`}
                    placeholder="johndoe123"
                    value={formData.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    onBlur={() => handleBlur("username")}
                    style={{ paddingRight: "4rem" }}
                  />
                  <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "0.25rem", alignItems: "center", zIndex: 5 }}>
                    {checkingUsername && <span className="input-loading-indicator"></span>}
                    {!checkingUsername && usernameAvailable && (
                      <span className="username-available-text" style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "600" }}>Available</span>
                    )}
                  </div>
                </div>
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    className={`${getInputClass("email")} form-input-with-icon`}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    className={`${getInputClass("password")} form-input-with-icon`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                  />
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div className="form-input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    type="text"
                    className={`${getInputClass("mobile")} form-input-with-icon`}
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => handleFieldChange("mobile", e.target.value)}
                    onBlur={() => handleBlur("mobile")}
                  />
                </div>
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>

              <div className="form-checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleFieldChange("agreeToTerms", e.target.checked)}
                    onBlur={() => handleBlur("agreeToTerms")}
                  />
                  <span className="custom-checkmark"></span>
                  <span className="checkbox-text">
                    Share my registration data with Super App services.
                  </span>
                </label>
                {errors.agreeToTerms && touched.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn">
                SIGN UP
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmission} className="form-container">
              {loginErrors.general && (
                <div style={{
                  background: "rgba(255, 77, 77, 0.1)",
                  border: "1px solid var(--color-danger)",
                  color: "var(--color-danger)",
                  padding: "0.75rem 1rem",
                  borderRadius: "var(--border-radius-sm)",
                  fontSize: "0.85rem",
                  marginBottom: "1.25rem",
                  fontWeight: "500",
                  animation: "scaleIn 0.2s ease-out"
                }}>
                  {loginErrors.general}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    className={`${getLoginInputClass("email")} form-input-with-icon`}
                    placeholder="john@example.com"
                    value={loginData.email}
                    onChange={(e) => handleLoginFieldChange("email", e.target.value)}
                    onBlur={() => handleLoginBlur("email")}
                  />
                </div>
                {loginErrors.email && <span className="error-text">{loginErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    type="password"
                    className={`${getLoginInputClass("password")} form-input-with-icon`}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => handleLoginFieldChange("password", e.target.value)}
                    onBlur={() => handleLoginBlur("password")}
                  />
                </div>
                {loginErrors.password && <span className="error-text">{loginErrors.password}</span>}
              </div>

              <button type="submit" className="btn btn-primary form-submit-btn" style={{ marginTop: "1rem" }}>
                SIGN IN
              </button>
            </form>
          )}

          <div className="form-footer-notes">
            <p>
              By signing up, you agree to Super App's <span>Terms and Conditions of Use</span>.
            </p>
            <p>
              To learn more about how Super App collects, uses, shares and protects your personal data please read Super App's <span>Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
      
      {isSubmitting && (
        <div className="auth-loading-overlay">
          <div className="auth-loading-card glass-panel animate-scale-in">
            <div className="loading-spinner" style={{ width: "36px", height: "36px" }}></div>
            <p style={{ marginTop: "1rem", fontWeight: "600", color: "#fff", letterSpacing: "0.02em", textAlign: "center" }}>
              {submitMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
