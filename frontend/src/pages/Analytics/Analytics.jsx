import { useState, useEffect } from 'react';
import { FiBarChart3, FiTrendingUp, FiUsers, FiAlertCircle } from 'react-icons/fi';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import styles from './Analytics.module.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Mock analytics data
    setAnalyticsData({
      totalAnalyzed: 10234,
      violationsDetected: 3421,
      complianceRate: 87,
      activeUsers: 542,
      topViolations: [
        { name: 'No Helmet', count: 1845, percentage: 54 },
        { name: 'Improper Helmet', count: 892, percentage: 26 },
        { name: 'Helmet Not Fastened', count: 684, percentage: 20 },
      ],
      dailyTrend: [
        { date: 'Mon', analyzed: 120, violations: 45 },
        { date: 'Tue', analyzed: 150, violations: 52 },
        { date: 'Wed', analyzed: 180, violations: 68 },
        { date: 'Thu', analyzed: 165, violations: 58 },
        { date: 'Fri', analyzed: 200, violations: 72 },
        { date: 'Sat', analyzed: 190, violations: 65 },
        { date: 'Sun', analyzed: 145, violations: 48 },
      ],
      cityData: [
        { city: 'Delhi', violations: 845, compliance: 82 },
        { city: 'Mumbai', violations: 720, compliance: 89 },
        { city: 'Bangalore', violations: 568, compliance: 91 },
        { city: 'Chennai', violations: 432, compliance: 88 },
        { city: 'Pune', violations: 380, compliance: 92 },
        { city: 'Hyderabad', violations: 496, compliance: 85 },
      ],
    });
  }, []);

  if (!analyticsData) return <div>Loading...</div>;

  return (
    <div className={styles.analytics}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Analytics Dashboard</h1>
          <p>Real-time helmet compliance monitoring and traffic violation analysis</p>
        </div>

        {/* KPI Cards */}
        <div className={styles.kpiGrid}>
          <Card variant="default" className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIcon} style={{ color: '#0f4c81' }}>
                <FiBarChart3 size={24} />
              </div>
              <h3>Total Analyzed</h3>
            </div>
            <div className={styles.kpiValue}>{analyticsData.totalAnalyzed.toLocaleString()}</div>
            <div className={styles.kpiSubtext}>Images processed</div>
          </Card>

          <Card variant="default" className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIcon} style={{ color: '#c62828' }}>
                <FiAlertCircle size={24} />
              </div>
              <h3>Violations</h3>
            </div>
            <div className={styles.kpiValue}>{analyticsData.violationsDetected.toLocaleString()}</div>
            <div className={styles.kpiSubtext}>Detected</div>
          </Card>

          <Card variant="default" className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIcon} style={{ color: '#2e7d32' }}>
                <FiTrendingUp size={24} />
              </div>
              <h3>Compliance Rate</h3>
            </div>
            <div className={styles.kpiValue}>{analyticsData.complianceRate}%</div>
            <div className={styles.kpiSubtext}>Overall compliance</div>
          </Card>

          <Card variant="default" className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <div className={styles.kpiIcon} style={{ color: '#ed6c02' }}>
                <FiUsers size={24} />
              </div>
              <h3>Active Users</h3>
            </div>
            <div className={styles.kpiValue}>{analyticsData.activeUsers}</div>
            <div className={styles.kpiSubtext}>Using system</div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          {/* Top Violations */}
          <Card variant="default" className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Top Violations</h2>
            <div className={styles.violationsList}>
              {analyticsData.topViolations.map((violation, index) => (
                <div key={index} className={styles.violationItem}>
                  <div className={styles.violationInfo}>
                    <span className={styles.violationName}>{violation.name}</span>
                    <span className={styles.violationCount}>{violation.count} cases</span>
                  </div>
                  <div className={styles.violationBar}>
                    <div
                      className={styles.violationFill}
                      style={{ width: `${violation.percentage}%` }}
                    />
                  </div>
                  <span className={styles.violationPercent}>{violation.percentage}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily Trend */}
          <Card variant="default" className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Weekly Trend</h2>
            <div className={styles.trendChart}>
              {analyticsData.dailyTrend.map((day, index) => (
                <div key={index} className={styles.trendBar}>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${(day.analyzed / 200) * 100}%`,
                        backgroundColor: '#0f4c81',
                      }}
                      title={`${day.analyzed} analyzed`}
                    />
                    <div
                      className={styles.bar}
                      style={{
                        height: `${(day.violations / 200) * 100}%`,
                        backgroundColor: '#c62828',
                      }}
                      title={`${day.violations} violations`}
                    />
                  </div>
                  <span className={styles.dayLabel}>{day.date}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#0f4c81' }} />
                Analyzed
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#c62828' }} />
                Violations
              </div>
            </div>
          </Card>
        </div>

        {/* City Data */}
        <Card variant="default" className={styles.tableCard}>
          <h2 className={styles.chartTitle}>City-wise Performance</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Violations Detected</th>
                  <th>Compliance Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.cityData.map((city, index) => (
                  <tr key={index}>
                    <td>{city.city}</td>
                    <td>{city.violations}</td>
                    <td>{city.compliance}%</td>
                    <td>
                      <Badge variant={city.compliance >= 90 ? 'success' : city.compliance >= 85 ? 'primary' : 'warning'}>
                        {city.compliance >= 90 ? 'Excellent' : city.compliance >= 85 ? 'Good' : 'Needs Attention'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
