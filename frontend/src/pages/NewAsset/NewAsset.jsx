import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const NewAsset = () => {
  const [assetData, setAssetData] = useState({
    name: '',
    type: '',
    resources: {
      resource1: '',
      resource2: '',
      resource3: '',
      resource4: ''
    },
    indices: {
      index1: '',
      index2: '',
      index3: '',
      index4: '',
      index5: ''
    }
  });
  const [employees, setEmployees] = useState([]);
  const [resourcesList, setResourcesList] = useState([]); // ذخیره لیست منابع

  useEffect(() => {
    // Fetch employees from the database to populate the RACI fields
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        setEmployees(response.data.data); // Assuming the response contains a list of employees
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();

    // Fetch resources from the database to populate the resource fields
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/resources'); // Adjust the API endpoint as needed
        setResourcesList(response.data); // Assuming the response contains a list of resources
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('resource')) {
      setAssetData(prevState => ({
        ...prevState,
        resources: {
          ...prevState.resources,
          [name]: value
        }
      }));
    } else if (name.includes('index')) {
      setAssetData(prevState => ({
        ...prevState,
        indices: {
          ...prevState.indices,
          [name]: value
        }
      }));
    } else {
      setAssetData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/assets', assetData);
      alert('Asset added successfully');
      setAssetData({
        name: '',
        type: '',
        resources: { resource1: '', resource2: '', resource3: '', resource4: '' },
        indices: { index1: '', index2: '', index3: '', index4: '', index5: '' }
      });
    } catch (error) {
      alert('Error adding asset');
      console.error('Error:', error);
    }
  };

  return (
    <Box dir="rtl">
      <Typography  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="h5" gutterBottom>
        افزودن دارایی جدید
      </Typography>
      <form onSubmit={handleSubmit}  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>
        <Grid container spacing={3}>
          {/* Row 1: Asset Name and Type */}
          <Grid item xs={12} sm={6} >
            <TextField
              label="نام دارایی"
              name="name"
              value={assetData.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="نوع دارایی"
              name="type"
              value={assetData.type}
              onChange={handleChange}
              fullWidth
              required
              sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
            />
          </Grid>

          {/* Row 2: Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>
              <InputLabel  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>منبع ۱</InputLabel>
              <Select
                label="منبع ۱"
                name="resource1"
                value={assetData.resources.resource1}
                onChange={handleChange}
                sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
              >
                {resourcesList.map((resource, index) => (
                <MenuItem key={index} value={resource.name}>{resource.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>منبع ۲</InputLabel>
              <Select
                label="منبع ۲"
                name="resource2"
                value={assetData.resources.resource2}
                onChange={handleChange}
                sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
              >
                {resourcesList.map((resource, index) => (
                   <MenuItem key={index} value={resource.name}>{resource.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>منبع ۳</InputLabel>
              <Select
                label="منبع ۳"
                name="resource3"
                value={assetData.resources.resource3}
                onChange={handleChange}
              >
                {resourcesList.map((resource, index) => (
             <MenuItem key={index} value={resource.name}>{resource.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>منبع ۴</InputLabel>
              <Select
                label="منبع ۴"
                name="resource4"
                value={assetData.resources.resource4}
                onChange={handleChange}
              >
                {resourcesList.map((resource, index) => (
                  <MenuItem key={index} value={resource.name}>{resource.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Row 3: Indices */}
          {['index1', 'index2', 'index3', 'index4', 'index5'].map((index, i) => (
            <Grid item xs={12} sm={6} md={2} key={i} >
              <TextField
                label={`شاخص ${i + 1}`}
                
                name={index}
                value={assetData.indices[index]}
                onChange={handleChange}
                type="number"
                fullWidth
                inputProps={{
                  min: 0,        // حداقل مقدار
                  max: 100,      // حداکثر مقدار
                  step: 1   
                       // گام تغییرات
                }}
              />
            </Grid>
          ))}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>
              افزودن دارایی
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default NewAsset;
