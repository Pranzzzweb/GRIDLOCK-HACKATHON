import { useState, useContext } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ToastContext from '@/context/ToastContext';
import styles from './Contact.module.css';

const Contact = () => {
  const { success, error } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail size={24} />,
      title: 'Email',
      details: ['support@smarthelmet.gov.in', 'info@smarthelmet.gov.in'],
    },
    {
      icon: <FiPhone size={24} />,
      title: 'Phone',
      details: ['+91-11-XXXX-XXXX', '+91-11-YYYY-YYYY'],
    },
    {
      icon: <FiMapPin size={24} />,
      title: 'Address',
      details: ['New Delhi, India', 'Smart City Mission Office'],
    },
  ];

  return (
    <div className={styles.contact}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Get In Touch</h1>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className={styles.grid}>
          {/* Contact Information */}
          <div className={styles.infoSection}>
            <h2>Contact Information</h2>
            <div className={styles.infoGrid}>
              {contactInfo.map((info, index) => (
                <Card key={index} variant="default" className={styles.infoCard}>
                  <div className={styles.infoIcon}>{info.icon}</div>
                  <h3>{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className={styles.detail}>
                      {detail}
                    </p>
                  ))}
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formSection}>
            <Card variant="default" className={styles.formCard}>
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Message subject"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows="6"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading}
                >
                  <FiSend size={20} />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
