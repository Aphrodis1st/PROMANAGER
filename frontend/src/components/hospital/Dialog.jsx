import React from 'react';
import { Modal } from './Modal';

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <Modal isOpen={open} onClose={() => onOpenChange(false)}>
      {children}
    </Modal>
  );
};

const DialogTrigger = ({ children, asChild, ...props }) => {
  return React.cloneElement(children, props);
};

const DialogContent = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg p-6 max-w-md mx-auto ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
};

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };