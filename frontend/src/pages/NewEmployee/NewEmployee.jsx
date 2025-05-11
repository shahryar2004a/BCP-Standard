// pages/NewEmployee.jsx
import React from 'react';
import axios from 'axios';
import FormLayout from '../../components/FormLayout/FormLayout';

export default function NewEmployee() {
  const fields = [
    { name: 'firstName', label: 'نام', type: 'text', grid: { xs:12, sm:6 } },
    { name: 'lastName', label: 'نام خانوادگی', type: 'text', grid: { xs:12, sm:6 } },
    { name: 'phone', label: 'تلفن', type: 'text', grid: { xs:12, sm:6 } },
    { name: 'email', label: 'ایمیل', type: 'email', grid: { xs:12, sm:6 } },
    { name: 'address', label: 'آدرس', type: 'text', grid: { xs:12 } },
    { name: 'emergencyStatus', label: 'وضعیت اضطراری', type: 'select', options: [
        { value: 'Active', label: 'فعال' },
        { value: 'Inactive', label: 'غیرفعال' }
      ], grid: { xs:12, sm:6 }
    },
    { name: 'department', label: 'دپارتمان', type: 'text', grid: { xs:12, sm:6 } },
  ];

  const onSubmit = async (values) => {
    await axios.post('http://localhost:5000/api/employees', values);
  };

  return (
    <FormLayout
      title="فرم اضافه کردن کارمند جدید"
      fields={fields}
      onSubmit={onSubmit}
    />
  );
}