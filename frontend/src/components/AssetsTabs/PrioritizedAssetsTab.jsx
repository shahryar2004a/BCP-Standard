import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const PrioritizedAssetsTab = () => {
  const [assets, setAssets] = useState([]);
  const [editedAssets, setEditedAssets] = useState({});
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsResponse, employeesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/assets"),
          axios.get("http://localhost:5000/api/employees"),
        ]);
        setAssets(assetsResponse.data.data);
        setEmployees(employeesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = (id, field, value) => {
    setEditedAssets((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value, // ذخیره آیدی کارمند به جای نام
      },
    }));
  };

  const handleSaveChanges = async () => {
    const updates = Object.entries(editedAssets).map(async ([assetId, changes]) => {
      // ایجاد آرایه‌ای برای مسئولیت‌های هر کارمند
      const responsibilityRecords = [];

      // برای هر نقش (مسئول، مشاوره، آگاه‌شده و حمایت)
      ["responsible", "support", "consulted", "informed"].forEach((role) => {
        if (changes[role]) {
          responsibilityRecords.push({
            assetId, // آیدی دارایی
            employeeId: changes[role], // آیدی کارمندی که مسئولیت دارد
            responsibilities: [role], // مسئولیت مربوط به کارمند
          });
        }
      });

      // ارسال رکوردهای مسئولیت به سرور
      try {
        const response = await Promise.all(
          responsibilityRecords.map((record) =>
            axios.post("http://localhost:5000/api/responsibility", record)
          )
        );
        console.log(`Responsibilities for asset ${assetId} updated successfully!`);
        return { success: true, assetId };
      } catch (error) {
        console.error(`Error updating responsibilities for asset ${assetId}:`, error);
        return { success: false, assetId, error };
      }
    });

    const results = await Promise.all(updates);

    // بررسی نتایج و نمایش پیام‌های موفقیت و خطا
    const successUpdates = results.filter((result) => result.success);
    const failedUpdates = results.filter((result) => !result.success);

    if (successUpdates.length > 0) {
      alert(`${successUpdates.length} responsibility record(s) updated successfully!`);
    }
    if (failedUpdates.length > 0) {
      alert(
        `${failedUpdates.length} responsibility record(s) failed to update. Check console for details.`
      );
    }

    // بازنشانی وضعیت و به‌روزرسانی جدول
    setEditedAssets({});
    setLoading(true);
    try {
      const updatedAssetsResponse = await axios.get("http://localhost:5000/api/assets");
      setAssets(updatedAssetsResponse.data.data);
    } catch (error) {
      console.error("Error refreshing assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (indices) => {
    if (!indices || Object.keys(indices).length === 0) return "0.00";
    const values = Object.values(indices);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return (sum / values.length).toFixed(2);
  };

  if (loading) return <div>Loading...</div>;

  const columns = [
    { field: "_id", headerName: "ID", width: 100, align: "center", headerAlign: "center" },
    { field: "name", headerName: "نام", width: 150, align: "center", headerAlign: "center" },
    {
      field: "indices",
      headerName: "میانگین شاخص ها",
      align: "center",
      headerAlign: "center",
      width: 150,
      valueGetter: (params) => calculateAverage(params || {}),
    },
    ...["responsible", "support", "consulted", "informed"].map((role) => ({
      field: role,
      headerName: role.charAt(0).toUpperCase() + role.slice(1),
      width: 200,
      align: "center",
       headerAlign: "center",
      renderCell: (params) => (
        <Select
        sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} 
          value={editedAssets[params.row._id]?.[role] || ""}
          onChange={(e) => handleSelectChange(params.row._id, role, e.target.value)}
          fullWidth
        >
          {employees.map((employee) => (
            <MenuItem  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}  key={employee._id} value={employee._id}>
              {`${employee.firstName} ${employee.lastName}`}
            </MenuItem>
          ))}
        </Select>
      ),
    })),
  ];

  return (
    <Box>
      <DataGrid
        rows={assets}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row._id}
        autoHeight
        sx={{
          '& .MuiDataGrid-cell': {
            fontFamily: '"Yekan Bakh", sans-serif', // اعمال فونت به تمام سلول‌ها
          },
          '& .MuiDataGrid-columnHeader': {
            fontFamily: '"Yekan Bakh", sans-serif', // اعمال فونت به سرستون‌ها
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveChanges}
        sx={{ mt: 2, fontWeight: "bold",fontFamily: '"Yekan Bakh", sans-serif' }}
     
      >
        ذخیره
      </Button>
    </Box>
  );
};

export default PrioritizedAssetsTab;
