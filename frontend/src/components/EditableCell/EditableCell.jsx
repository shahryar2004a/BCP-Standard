import React from 'react';
import { TextField, Select, MenuItem } from '@mui/material';

const EditableCell = ({ value, onChange, resourcesList, type, index }) => {
  if (type === 'number') {
    return (
      <TextField
        type="number"
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (type === 'select') {
    return (
      <Select value={value} onChange={(e) => onChange(e.target.value)} fullWidth>
        <MenuItem value="">None</MenuItem>
        {resourcesList.map((resource) => (
          <MenuItem key={resource.name} value={resource.name}>
            {resource.name}
          </MenuItem>
        ))}
      </Select>
    );
  }

  return null;
};

export default EditableCell;
