import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

function Nav() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>BookMark</h2>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>  {/* Links to / */}
        <li><Link to="/">About Us</Link></li>  {/* Links to contact us */}
        <li><Link to="/add-review">Add Review</Link></li>  {/* Links to /add-review */}
        <li><Link to="/all-reviews">All Reviews</Link></li>  {/* Links to /all-reviews */}
        <li><Link to="/">Contact Us</Link></li>  {/* Links to contact us */}
      </ul>
    </nav>
  );
}

export default Nav;
