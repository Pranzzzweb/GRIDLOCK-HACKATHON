import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import { FaDownload, FaSearch, FaFilter } from 'react-icons/fa';

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setRecords(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch history, using fallback data");
        // Fallback data for demo
        setRecords([
          { id: '1042', date: '2023-10-24 14:32:01', vehicle: 'DL 4C AB 1234', type: 'No Helmet', conf: 0.94 },
          { id: '1043', date: '2023-10-24 14:35:12', vehicle: 'HR 26 DQ 5555', type: 'Triple Riding', conf: 0.88 },
          { id: '1044', date: '2023-10-24 14:40:05', vehicle: 'MH 12 XY 9090', type: 'Wrong Side', conf: 0.91 },
          { id: '1045', date: '2023-10-24 14:45:22', vehicle: 'UP 16 Z 1111', type: 'No Helmet', conf: 0.95 },
          { id: '1046', date: '2023-10-24 14:50:33', vehicle: 'Unknown', type: 'No Helmet', conf: 0.82 },
        ]);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredRecords = records.filter(record => 
    record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-page container">
      <div className="page-header">
        <h1>Violation History</h1>
        <p>Search and review past violation records.</p>
      </div>

      <div className="card">
        <div className="table-controls mb-3">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Vehicle No. or Violation Type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline filter-btn">
            <FaFilter /> Filter
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading records...</div>
        ) : (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date & Time</th>
                  <th>Vehicle Number</th>
                  <th>Violation Type</th>
                  <th>Confidence</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>#{record.id}</td>
                      <td>{record.date}</td>
                      <td><strong>{record.vehicle}</strong></td>
                      <td><span className="badge badge-error">{record.type}</span></td>
                      <td>{(record.conf * 100).toFixed(1)}%</td>
                      <td>
                        <button className="btn btn-sm btn-outline" title="Download Report">
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .history-page {
          padding: 20px;
        }

        .table-controls {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-box input {
          margin-bottom: 0;
          padding-left: 36px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .history-table th, .history-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .history-table th {
          background-color: #f9fbfd;
          color: #666;
          font-weight: 600;
        }

        .history-table tr:hover {
          background-color: #f8f9fa;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .badge-error {
          background-color: #fadbd8;
          color: #c0392b;
        }

        .btn-sm {
          padding: 6px 12px;
        }

        @media (max-width: 768px) {
          .table-controls {
            flex-direction: column;
          }
          .search-box {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default History;
