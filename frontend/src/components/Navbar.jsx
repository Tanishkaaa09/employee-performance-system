import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">AI Performance Analytics</Link>
        {isAuthenticated && (
          <div className="nav-links">
            <Link to="/" className="btn">Dashboard</Link>
            <Link to="/add-employee" className="btn btn-primary">Add Employee</Link>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
