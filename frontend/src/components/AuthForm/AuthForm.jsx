
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useForm } from '../Hook/useForm';

/**
 * AuthForm component handles both Login and Register forms
 * Props:
 * - title: string
 * - fields: array of { name, label, type, default?, required? }
 * - submitLabel: string
 * - onSubmit: async function that receives values and returns optional success message
 * - footerText: string
 * - footerLink: { label: string, to: string, onClick?: function }
 */
export default function AuthForm({
  title,
  fields,
  submitLabel,
  onSubmit,
  footerText,
  footerLink
}) {
  const { values, handleChange, handleSubmit, error, success, loading } =
    useForm(
      fields.reduce((acc, f) => ({ ...acc, [f.name]: f.default ?? '' }), {}),
      onSubmit
    );

  return (
    <Box
      dir="rtl"
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        mt: 6,
        p: 6,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 6,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 3, fontFamily: '"Yekan Bakh"' }}
      >
        {title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {fields.map((field) =>
          field.type === 'checkbox' ? (
            <FormControlLabel
              key={field.name}
              control={
                <Checkbox
                  name={field.name}
                  checked={values[field.name]}
                  onChange={handleChange}
                />
              }
              label={field.label}
              sx={{ fontFamily: '"Yekan Bakh"', display: 'block', mb: 2 }}
            />
          ) : (
            <TextField
              key={field.name}
              name={field.name}
              type={field.type}
              label={field.label}
              fullWidth
              required={field.required !== false}
              value={values[field.name]}
              onChange={handleChange}
              sx={{ mb: 2, fontFamily: '"Yekan Bakh"' }}
            />
          )
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5, fontFamily: '"Yekan Bakh"' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : submitLabel}
        </Button>
      </Box>

      {footerText && footerLink && (
        <Typography align="center" sx={{ mt: 2, fontFamily: '"Yekan Bakh"' }}>
          {footerText}{' '}
          <Button
            variant="text"
            onClick={footerLink.onClick}
            href={footerLink.to}
            sx={{ textTransform: 'none', fontFamily: '"Yekan Bakh"' }}
          >
            {footerLink.label}
          </Button>
        </Typography>
      )}
    </Box>
  );
}
