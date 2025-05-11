import React, { useEffect, useState } from 'react';
import { Select, MenuItem, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, TextField } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function AssetsTab() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedData, setEditedData] = useState({}); // مدیریت تغییرات در یک state
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourcesList, setResourcesList] = useState([]);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsResponse, resourcesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/assets"),
          axios.get("http://localhost:5000/api/resources"),
        ]);
        setAssets(assetsResponse.data.data);
        setResourcesList(resourcesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditChange = (assetId, field, value) => {
    setEditedData((prev) => {
      const updated = {
        ...prev,
        [assetId]: {
          ...prev[assetId],
          [field]: value,
        },
      };
      setHasChanges(true);
      return updated;
    });
  };

  const saveEditedData = async () => {
    try {
      const updates = Object.entries(editedData).map(async ([assetId, changes]) => {
        await axios.patch(`http://localhost:5000/api/assets/${assetId}`, changes);
      });

      await Promise.all(updates);

      const response = await axios.get("http://localhost:5000/api/assets");
      setAssets(response.data.data);
      setEditedData({});
      setHasChanges(false);
      console.log("Changes saved successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const openDeleteDialog = (asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!selectedAsset) return;
  
  
    // حذف دارایی از دیتابیس دارایی‌ها
    try {
      await axios.delete(`http://localhost:5000/api/assets/${selectedAsset._id}`);
    } catch (error) {
      console.error("Error deleting asset:", error);
    }

    // حذف رکورد مربوط به دارایی از دیتابیس مسئولیت‌ها
    try {
      await axios.delete(`http://localhost:5000/api/responsibility/${selectedAsset._id}`);
    } catch (error) {
      console.error("Error deleting responsibilities:", error);
    }

      // به‌روزرسانی لیست دارایی‌ها
      setAssets(assets.filter((asset) => asset._id !== selectedAsset._id));
  
      setDeleteDialogOpen(false);
      setSelectedAsset(null);
      
      console.log("Asset and related responsibilities deleted successfully.");
    } catch (error) {
      console.error("Error deleting asset or responsibilities:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Typography sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}  variant="h6">همه ی دارایی ها</Typography>
      <DataGrid
        rows={assets}
        columns={[
          { field: '_id', headerName: 'ID', width: 50, align: "center", headerAlign: "center" },
          { field: 'name', headerName: 'نام', width: 100, align: "center", headerAlign: "center" },
          { field: 'type', headerName: 'نوع', width: 100, align: "center", headerAlign: "center" },
          ...Array.from({ length: 5 }, (_, i) => ({
            field: `index${i + 1}`,
            headerName: `شاخص ${i + 1}`,
            width: 100,
            renderCell: (params) => (
              <TextField
              sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
                type="number"
                size="small"
                value={editedData[params.row._id]?.[`index${i + 1}`] ?? params.row.indices?.[`index${i + 1}`] ?? ''}
                onChange={(e) =>
                  handleEditChange(params.row._id, `index${i + 1}`, e.target.value)
                }
              />
            ),
          })),
          ...Array.from({ length: 4 }, (_, i) => ({
            field: `resource${i + 1}`,
            headerName: `منبع ${i + 1}`,
            width: 130,
            renderCell: (params) => (
              <Select
              sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
              value={
                resourcesList.some(resource => resource.name === (
                  editedData[params.row._id]?.[`resource${i + 1}`] ??
                  params.row.resources?.[`resource${i + 1}`] ??
                  ''
                ))
                  ? (editedData[params.row._id]?.[`resource${i + 1}`] ??
                     params.row.resources?.[`resource${i + 1}`] ??
                     '')
                  : ''
              }
              onChange={(e) =>
                handleEditChange(params.row._id, `resource${i + 1}`, e.target.value)
              }
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {resourcesList.map((resource) => (
                <MenuItem
                  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
                  key={resource.name}
                  value={resource.name}
                >
                  {resource.name}
                </MenuItem>
              ))}
            </Select>
            ),
          })),
          {
            field: 'action',
            headerName: "Action",
            width: 100,
            align: "center",
            headerAlign: "center",
            renderCell: (params) => (
              <Button sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="contained" color="error" onClick={() => openDeleteDialog(params.row)}>
                حذف
              </Button>
            ),
          },
        ]}
        pageSize={pageSize} // تعداد ردیف‌ها در هر صفحه
        pagination
        pageSizeOptions={[8]} // تعداد ردیف‌ها در صفحه، در اینجا فقط ۸
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // تغییر اندازه صفحه
       
        getRowId={(row) => row._id}
        sx={{
          '& .MuiDataGrid-cell': {
            fontFamily: '"Yekan Bakh", sans-serif', // اعمال فونت به تمام سلول‌ها
          },
          '& .MuiDataGrid-columnHeader': {
            fontFamily: '"Yekan Bakh", sans-serif', // اعمال فونت به سرستون‌ها
          },
        }}
      />
      <Button sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}  variant="contained" color="primary" onClick={saveEditedData} disabled={!hasChanges}>
        ذخیره تغییرات
      </Button>

      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} >اخطار</DialogTitle>
        <DialogContent sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} >مطمئنی که میخوای دارایی را حذف کنی؟</DialogContent>
        <DialogActions>
          <Button sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}  onClick={() => setDeleteDialogOpen(false)}>لغو</Button>
          <Button sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}  color="error" onClick={handleDelete}>حذف</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
