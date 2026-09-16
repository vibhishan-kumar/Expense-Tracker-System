import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { IndianRupee } from 'lucide-react';

const AnalyticsCharts = ({ userId, refreshKey }) => {
  const [data, setData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get(`/api/analytics/${userId}`);
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics, refreshKey]);

  if (!data) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px', background: 'var(--accent-gradient)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h3 style={{ color: '#fff', marginBottom: '8px', opacity: 0.9 }}>Available Balance</h3>
      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center' }}>
        <IndianRupee size={32} /> {Number(data.totals?.balance || 0).toFixed(2)}
      </div>
      <div style={{ display: 'flex', gap: '24px', marginTop: '16px', color: '#fff' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Income</span>
          <div style={{ fontWeight: 600 }}>+₹{Number(data.totals?.income || 0).toFixed(2)}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
          <span style={{ opacity: 0.8, fontSize: '0.85rem' }}>Expenses</span>
          <div style={{ fontWeight: 600 }}>-₹{Number(data.totals?.expense || 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
