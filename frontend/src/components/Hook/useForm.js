
import { useState } from 'react';

export function useForm(initial = {}, onSubmit) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await onSubmit(values);
      setSuccess('عملیات با موفقیت انجام شد');
      setError('');
      setValues(initial);
    } catch (err) {
      setError('خطا در ارسال داده');
      setSuccess('');
    }
  };
  return { values, handleChange, handleSubmit, error, success };
}
