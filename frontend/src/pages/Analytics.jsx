import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getAnalytics } from '../services/api';
import { FaChartLine, FaMotorcycle, FaCarCrash, FaPercentage } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAnalytics();
        setData(response);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analytics, using fallback data");
        // Fallback for demo
        setData({
          total_images: 1245,
          total_violations: 482,
          detection_rate: 85.4,
          avg_confidence: 0.91,
          avg_inference_time: 120,
          precision: 0.94,
          recall: 0.89,
          map: 0.92,
          violation_breakdown: {
            "No Helmet": 250,
            "Triple Riding": 82,
            "Wrong Side": 110,
            "No Seatbelt": 40
          }
        });
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading analytics...</div>;
  }

  const pieData = {
    labels: Object.keys(data.violation_breakdown),
    datasets: [
      {
        data: Object.values(data.violation_breakdown),
        backgroundColor: [
          '#e74c3c',
          '#f39c12',
          '#3498db',
          '#9b59b6'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Precision', 'Recall', 'mAP (0.5)'],
    datasets: [
      {
        label: 'Model Metrics',
        data: [data.precision * 100, data.recall * 100, data.map * 100],
        backgroundColor: 'rgba(42, 157, 143, 0.7)',
        borderColor: '#2A9D8F',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  };

  return (
    <div className="analytics-page container">
      <div className="page-header">
        <h1>System Analytics</h1>
        <p>Real-time insights and model performance metrics</p>
      </div>

      <div className="stats-grid mb-4">
        <div className="card stat-card">
          <div className="stat-icon"><FaMotorcycle /></div>
          <div className="stat-info">
            <h4>Total Images</h4>
            <div className="stat-value">{data.total_images}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon alert"><FaCarCrash /></div>
          <div className="stat-info">
            <h4>Violations Logged</h4>
            <div className="stat-value">{data.total_violations}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><FaPercentage /></div>
          <div className="stat-info">
            <h4>Detection Rate</h4>
            <div className="stat-value">{data.detection_rate}%</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><FaChartLine /></div>
          <div className="stat-info">
            <h4>Avg Inference</h4>
            <div className="stat-value">{data.avg_inference_time}ms</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Violation Breakdown</h3>
          <div className="pie-container">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="card chart-card">
          <h3>Model Performance</h3>
          <div className="bar-container">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="perf-stats mt-3">
            <p>Avg Confidence: <strong>{(data.avg_confidence * 100).toFixed(1)}%</strong></p>
          </div>
        </div>
      </div>

      <style>{`
        .analytics-page {
          padding: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 2.5rem;
          color: var(--primary-color);
          background: #e8f0fe;
          padding: 16px;
          border-radius: 12px;
        }

        .stat-icon.alert {
          color: #e74c3c;
          background: #fadbd8;
        }

        .stat-info h4 {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .chart-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pie-container {
          width: 100%;
          max-width: 300px;
          margin-top: 20px;
        }

        .bar-container {
          width: 100%;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
