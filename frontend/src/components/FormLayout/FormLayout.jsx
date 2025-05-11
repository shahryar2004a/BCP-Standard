import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert
} from '@mui/material';
import { useForm } from '../Hook/useForm';

export default function FormLayout({ title, fields, onSubmit }) {
  const initial = fields.reduce((acc, f) => ({ ...acc, [f.name]: f.default || '' }), {});
  const { values, handleChange, handleSubmit, error, success } = useForm(initial, onSubmit);

  return (
    <Box dir="rtl" sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>
        {title}
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fields.map(field => (
            <Grid item {...field.grid} key={field.name}>
              {field.type === 'select' ? (
                <FormControl fullWidth required>
                  <InputLabel sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    label={field.label}
                    value={values[field.name]}
                    onChange={handleChange}
                    sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
                  >
                    {field.options.map((opt) => {
                      const val = opt.value !== undefined ? opt.value : opt;
                      const lbl = opt.label !== undefined ? opt.label : opt;
                      return (
                        <MenuItem key={String(val)} value={val}>
                          {lbl}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  value={values[field.name]}
                  onChange={handleChange}
                  fullWidth
                  required={field.required !== false}
                  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
                  inputProps={field.inputProps}
                />
              )}
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>
              ارسال
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
