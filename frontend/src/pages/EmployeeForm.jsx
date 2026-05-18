import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };
      await api.post('/employees', dataToSubmit);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add employee');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Register New Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" name="department" className="form-input" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Skills (comma separated)</label>
            <input type="text" name="skills" className="form-input" value={formData.skills} onChange={handleChange} placeholder="React, Node, Python" required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Performance Score (0-100)</label>
              <input type="number" name="performanceScore" min="0" max="100" className="form-input" value={formData.performanceScore} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Years of Experience</label>
              <input type="number" name="experience" min="0" className="form-input" value={formData.experience} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Employee</button>
            <button type="button" onClick={() => navigate('/')} className="btn" style={{ flex: 1, background: 'var(--border)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
