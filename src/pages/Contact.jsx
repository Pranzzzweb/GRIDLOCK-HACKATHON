import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 500);
  };

  return (
    <div className="contact-page container">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Have questions about the project? Send us a message.</p>
      </div>

      <div className="contact-container card">
        {submitted ? (
          <div className="success-message text-center py-4">
            <h2>Thank You!</h2>
            <p>Your message has been received. We will get back to you shortly.</p>
            <button className="btn btn-outline mt-3" onClick={() => setSubmitted(false)}>
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                required 
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary w-100">
              <FaPaperPlane style={{ marginRight: '8px' }} /> Send Message
            </button>
          </form>
        )}
      </div>

      <style>{`
        .contact-page {
          padding: 20px;
        }

        .contact-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--secondary-color);
        }

        .w-100 {
          width: 100%;
        }

        .success-message h2 {
          color: var(--accent-color);
        }
      `}</style>
    </div>
  );
};

export default Contact;
