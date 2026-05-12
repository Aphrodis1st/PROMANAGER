import React from 'react';

const LoadingSpinner = ({ message = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      gap: '1rem'
    }}>
      <div 
        className={`${sizeClasses[size]} animate-spin`}
        style={{
          border: '3px solid #f3f4f6',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{message}</p>
      

    </div>
  );
};

export { LoadingSpinner };
export default LoadingSpinner;