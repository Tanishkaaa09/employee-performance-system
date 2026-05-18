import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get('/employees');
        const found = res.data.find(e => e._id === id);
        if (found) setEmployee(found);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEmployee();
  }, [id]);

  const generateAIRecommendation = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/recommend', { employee });
      setAiInsight(res.data.recommendation);
    } catch (error) {
      console.error(error);
      setAiInsight('Failed to generate recommendation.');
    } finally {
      setLoading(false);
    }
  };

  if (!employee) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>{employee.name}</h2>
          <div style={{ marginBottom: '1rem' }}><strong>Email:</strong> {employee.email}</div>
          <div style={{ marginBottom: '1rem' }}><strong>Department:</strong> {employee.department}</div>
          <div style={{ marginBottom: '1rem' }}><strong>Experience:</strong> {employee.experience} years</div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Performance Score:</strong> 
            <span style={{ marginLeft: '0.5rem', color: employee.performanceScore >= 80 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
              {employee.performanceScore}/100
            </span>
          </div>
          <div>
            <strong>Skills:</strong>
            <div style={{ marginTop: '0.5rem' }}>
              {employee.skills.map(skill => <span key={skill} className="badge">{skill}</span>)}
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(to bottom right, var(--card-bg), #0f172a)' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#A855F7' }}>✨</span> AI Recommendations
          </h2>
          
          {!aiInsight ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Generate personalized insights, promotion recommendations, and training suggestions using AI.
              </p>
              <button onClick={generateAIRecommendation} disabled={loading} className="btn btn-primary" style={{ background: '#A855F7' }}>
                {loading ? 'Analyzing...' : 'Generate Insights'}
              </button>
            </div>
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '0.5rem' }}>
              {aiInsight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
