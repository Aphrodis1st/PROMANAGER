import React from 'react';
import { TextField } from '@mui/material';

export const FormCard = ({ icon: Icon, title, description, iconBg = 'bg-blue-500', textFieldProps = {} }) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className={`${iconBg} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <TextField
        id={`field-${title.replace(/\s+/g, '-').toLowerCase()}`}
        variant="outlined"
        fullWidth
        size="small"
        {...textFieldProps}
      />
    </div>
  );
};

export default FormCard;
