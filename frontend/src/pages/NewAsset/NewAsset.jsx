// pages/NewAsset.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormLayout from '../../components/FormLayout/FormLayout';

export default function NewAsset() {
  const [resourcesList, setResourcesList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/resources')
      .then(res => setResourcesList(res.data))
      .catch(err => console.error(err));
  }, []);

  const fields = [
    { name: 'name', label: 'نام دارایی', type: 'text', grid: { xs:12, sm:6 } },
    { name: 'type', label: 'نوع دارایی', type: 'text', grid: { xs:12, sm:6 } },
    ...Array.from({ length: 4 }, (_, i) => ({
      name: `resources.resource${i+1}`,
      label: `منبع ${i+1}`,
      type: 'select',
      options: resourcesList.map(r => ({ value: r.name, label: r.name })),
      grid: { xs:12, sm:6, md:3 },
      default: ''
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      name: `indices.index${i+1}`,
      label: `شاخص ${i+1}`,
      type: 'number',
      grid: { xs:12, sm:6, md:2 },
      default: '',
      inputProps: { min:0, max:100, step:1 }
    })),
  ];

  const onSubmit = async (values) => {
    // تبدیل ساختار flat به nested
    const payload = {
      name: values['name'],
      type: values['type'],
      resources: {
        resource1: values['resources.resource1'],
        resource2: values['resources.resource2'],
        resource3: values['resources.resource3'],
        resource4: values['resources.resource4'],
      },
      indices: {
        index1: values['indices.index1'],
        index2: values['indices.index2'],
        index3: values['indices.index3'],
        index4: values['indices.index4'],
        index5: values['indices.index5'],
      }
    };
    await axios.post('http://localhost:5000/api/assets', payload);
  };

  return (
    <FormLayout
      title="افزودن دارایی جدید"
      fields={fields}
      onSubmit={onSubmit}
    />
  );
}