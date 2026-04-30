import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to='/' style={styles.link}>Home</Link>
      <Link to='/stock/inventory' style={styles.link}>Stock Management</Link>
      <Link to='/hospital/admin/dashboard' style={styles.link}>Hospital Services</Link>
      <Link to='/pharmacy/dashboard' style={styles.link}>Pharmacy Services</Link>
      <Link to='/admin' style={styles.link}>Admin</Link> 
      <Link to='/register' style={styles.link}>Register</Link>
      <Link to='/login' style={{ ...styles.link, marginLeft: 'auto' }}>Login</Link>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    gap: 40,
    padding: '12px 20px',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: 'rgb(35,183,88)',
    color: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    opacity: 1,
  },
  link: {
    color: '#fff',          // white text
    textDecoration: 'none', // remove underline
    transition: 'color 0.2s',
  },
};

// Add hover effect for links
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.color = '#e0ffd8'; // slightly brighter on hover
    });
    link.addEventListener('mouseleave', () => {
      link.style.color = '#fff';
    });
  });
});
