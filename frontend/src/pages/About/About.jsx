import { FiCheckCircle, FiUsers, FiTarget, FiAward } from 'react-icons/fi';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import styles from './About.module.css';

const About = () => {
  const mission = [
    {
      icon: <FiTarget size={32} />,
      title: 'Enhanced Safety',
      description: 'Promote road safety through automated helmet compliance detection',
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Community Protection',
      description: 'Protect communities by reducing traffic-related injuries and fatalities',
    },
    {
      icon: <FiCheckCircle size={32} />,
      title: 'Compliance Assurance',
      description: 'Ensure traffic rules compliance through intelligent monitoring',
    },
    {
      icon: <FiAward size={32} />,
      title: 'Best Practices',
      description: 'Set industry standards for AI-driven traffic monitoring solutions',
    },
  ];

  const team = [
    { role: 'Project Lead', name: 'Dr. Pranjali Singh', expertise: 'AI & Computer Vision' },
    { role: 'Backend Developer', name: 'Team Expert', expertise: 'API & Database' },
    { role: 'Frontend Developer', name: 'Team Expert', expertise: 'UI/UX & Web' },
    { role: 'ML Engineer', name: 'Team Expert', expertise: 'Machine Learning' },
  ];

  return (
    <div className={styles.about}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <Badge variant="primary" className={styles.badge}>
              🇮🇳 National Initiative
            </Badge>
            <h1>Smart Helmet Portal</h1>
            <p className={styles.tagline}>
              An AI-powered National Road Safety Monitoring System designed to enhance traffic
              compliance and reduce road accidents through intelligent helmet detection
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.mission}>
          <h2>Our Mission</h2>
          <div className={styles.missionGrid}>
            {mission.map((item, index) => (
              <Card key={index} variant="default" className={styles.missionCard}>
                <div className={styles.missionIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className={styles.technology}>
          <h2>Technology Stack</h2>
          <div className={styles.techGrid}>
            <Card variant="default" className={styles.techCard}>
              <h3>Computer Vision</h3>
              <p>Advanced CNN models for real-time object detection and classification</p>
              <ul>
                <li>YOLOv8 for fast detection</li>
                <li>Custom trained models</li>
                <li>Real-time processing</li>
              </ul>
            </Card>
            <Card variant="default" className={styles.techCard}>
              <h3>Machine Learning</h3>
              <p>Intelligent algorithms for accurate helmet compliance detection</p>
              <ul>
                <li>Deep Learning Networks</li>
                <li>Transfer Learning</li>
                <li>Model Optimization</li>
              </ul>
            </Card>
            <Card variant="default" className={styles.techCard}>
              <h3>Web Application</h3>
              <p>Modern, responsive interface for seamless user experience</p>
              <ul>
                <li>React.js Frontend</li>
                <li>RESTful APIs</li>
                <li>Real-time Analytics</li>
              </ul>
            </Card>
            <Card variant="default" className={styles.techCard}>
              <h3>Cloud Infrastructure</h3>
              <p>Scalable and secure cloud-based deployment</p>
              <ul>
                <li>Distributed Processing</li>
                <li>Enterprise Security</li>
                <li>High Availability</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.team}>
          <h2>Our Team</h2>
          <div className={styles.teamGrid}>
            {team.map((member, index) => (
              <Card key={index} variant="default" className={styles.teamCard}>
                <div className={styles.teamAvatar}>👤</div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamRole}>{member.role}</p>
                <p className={styles.teamExpertise}>{member.expertise}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.stats}>
          <h2>By The Numbers</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>10,234+</div>
              <div className={styles.statLabel}>Images Analyzed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>12</div>
              <div className={styles.statLabel}>Active Cities</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>87%</div>
              <div className={styles.statLabel}>Average Compliance</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>542</div>
              <div className={styles.statLabel}>Active Users</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
