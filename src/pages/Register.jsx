import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const Register = () => {
  const user = useStore((state) => state.user);
  const categories = useStore((state) => state.categories);
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
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
      setIsSubmitting(true);
      setSubmitMessage("Connecting to cloud gateway...");
      setTimeout(() => {
        setSubmitMessage("Encrypting profile credentials...");
        setTimeout(() => {
          setSubmitMessage("Redirecting to onboarding selection...");
          setTimeout(() => {
            setUser({
              name: formData.name,
              username: formData.username,
              email: formData.email,
              mobile: formData.mobile,
            });
            setIsSubmitting(false);
            navigate("/categories");
          }, 800);
        }, 1000);
      }, 800);
    }
  };

  const handleDirectSignIn = () => {
    setIsSubmitting(true);
    setSubmitMessage("Retrieving profile session state...");
    setTimeout(() => {
      setSubmitMessage("Signing in...");
      setTimeout(() => {
        const mockUser = {
          name: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          mobile: "9876543210",
        };
        setUser(mockUser);
        setIsSubmitting(false);
        if (categories.length >= 3) {
          navigate("/dashboard");
        } else {
          navigate("/categories");
        }
      }, 800);
    }, 1000);
  };

  const getInputClass = (field) => {
    if (!touched[field]) return "form-input";
    return errors[field] ? "form-input touched invalid" : "form-input touched valid";
  };

  return (
    <div className="register-page-container animate-fade-in">
      {/* Art Side Panel */}
      <div className="register-art-panel">
        <div className="art-overlay"></div>
        <div className="art-content">
          <h1 className="art-title">Super App</h1>
          <p className="art-subtitle">Organize your digital life, check weather, read news, and discover new cinema — all in one premium hub.</p>
          
          <div className="art-glass-mockup animate-slide-up" style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginTop: "2.5rem",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
            position: "relative",
            zIndex: 10
          }}>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.85rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }}></div>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--color-primary)", lineHeight: "1.5" }}>
              <p><span style={{ color: "var(--text-muted)" }}>$</span> initialize --project super-app</p>
              <p style={{ color: "var(--text-secondary)" }}>✓ Unified widgets synced</p>
              <p style={{ color: "var(--text-secondary)" }}>✓ Climate feed loaded</p>
              <p style={{ color: "var(--text-secondary)" }}>✓ Cinema recommendation engine active</p>
              <p style={{ color: "var(--color-accent)", marginTop: "0.5rem" }}>System ready for onboarding_</p>
            </div>
          </div>

          <div className="art-floating-grid">
            <div className="floating-bubble bubble-1"></div>
            <div className="floating-bubble bubble-2"></div>
            <div className="floating-bubble bubble-3"></div>
          </div>
        </div>
        <div className="art-footer-tag">
          Discover your next favorite movies
        </div>
      </div>

      {/* Form Side Panel */}
      <div className="register-form-panel">
        <div className="register-form-wrapper glass-panel animate-slide-up">
          <div className="form-header">
            <h2>Create an account</h2>
            <p style={{ display: "inline-flex", gap: "0.35rem", flexWrap: "wrap" }}>
              <span>Enter details or</span>
              <span 
                onClick={handleDirectSignIn} 
                style={{ 
                  color: "var(--color-primary)", 
                  cursor: "pointer", 
                  textDecoration: "underline",
                  fontWeight: "600"
                }}
              >
                Sign In directly
              </span>
            </p>
          </div>
          
          <form onSubmit={handleFormSubmission} className="form-container">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className={getInputClass("name")}
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className={getInputClass("username")}
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={(e) => handleFieldChange("username", e.target.value)}
                  onBlur={() => handleBlur("username")}
                  style={{ paddingRight: "4rem" }}
                />
                <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "0.25rem", alignItems: "center" }}>
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
              <input
                type="email"
                className={getInputClass("email")}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                className={getInputClass("mobile")}
                placeholder="9876543210"
                value={formData.mobile}
                onChange={(e) => handleFieldChange("mobile", e.target.value)}
                onBlur={() => handleBlur("mobile")}
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            <div className="form-checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleFieldChange("agreeToTerms", e.target.checked)}
                  onBlur={() => handleBlur("agreeToTerms")}
                />
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
