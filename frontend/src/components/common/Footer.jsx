import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* About Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>About</h3>
            <p className={styles.sectionText}>
              Smart Helmet Portal - National AI-powered Road Safety Monitoring System using
              Computer Vision and Traffic Violation Detection.
            </p>
            <div className={styles.socials}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
              <a href="mailto:support@example.com" aria-label="Email" title="Email">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/analyze">Analyze</Link>
              </li>
              <li>
                <Link to="/analytics">Analytics</Link>
              </li>
              <li>
                <Link to="/history">History</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Resources</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/about">About Project</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <a href="#privacy" aria-label="Privacy Policy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" aria-label="Terms of Service">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Government Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Government</h3>
            <ul className={styles.linkList}>
              <li>
                <a href="https://smartcities.gov.in" target="_blank" rel="noopener noreferrer">
                  Smart City Mission
                </a>
              </li>
              <li>
                <a href="https://morth.gov.in" target="_blank" rel="noopener noreferrer">
                  Ministry of Road Transport
                </a>
              </li>
              <li>
                <a href="https://nic.gov.in" target="_blank" rel="noopener noreferrer">
                  National Informatics Centre
                </a>
              </li>
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer">
                  Digital India
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Smart Helmet Portal. All rights reserved. Govt. of India - Smart City
            Mission.
          </p>
          <p className={styles.disclaimer}>
            <strong>Disclaimer:</strong> This system is designed for traffic monitoring and violation
            detection purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
