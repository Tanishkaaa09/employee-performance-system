import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async (dept = '') => {
    try {
      const url = dept ? `/employees/search?department=${dept}` : '/employees';
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm);
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Employee Analytics Dashboard</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search by Department..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          {searchTerm && <button type="button" className="btn" onClick={() => { setSearchTerm(''); fetchEmployees(''); }}>Clear</button>}
        </form>
      </div>

      <div className="employee-grid">
        {employees.map((emp) => (
          <div key={emp._id} className="card">
            <h3 style={{ marginBottom: '0.5rem' }}>{emp.name}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{emp.department}</p>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Score:</strong> <span style={{ color: emp.performanceScore >= 80 ? 'var(--success)' : 'var(--danger)' }}>{emp.performanceScore}/100</span>
              <span style={{ marginLeft: '1rem' }}><strong>Exp:</strong> {emp.experience} yrs</span>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              {emp.skills.slice(0, 3).map(skill => <span key={skill} className="badge">{skill}</span>)}
              {emp.skills.length > 3 && <span className="badge">+{emp.skills.length - 3}</span>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/employee/${emp._id}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Analytics</Link>
              <button onClick={() => deleteEmployee(emp._id)} className="btn btn-danger" style={{ padding: '0.5rem' }}>Delete</button>
            </div>
          </div>
        ))}
        {employees.length === 0 && <p>No employees found.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
