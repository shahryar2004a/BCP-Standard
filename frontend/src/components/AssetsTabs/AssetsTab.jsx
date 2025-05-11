import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import useApi from '../Hook/useApi';
import EditableCell from '../EditableCell/EditableCell';
import axios from 'axios';

export default function AssetsTab() {
  const {
    data: assets = [],
    loading: loadingAssets,
    error: assetsError,
  } = useApi("http://localhost:5000/api/assets");

  const {
    data: resourcesList = [],
    loading: loadingResources,
    error: resourcesError,
  } = useApi("http://localhost:5000/api/resources");

  const [editedData, setEditedData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState(8);

  // ترکیب دو loading
  if (loadingAssets || loadingResources) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // خطاها را هم می‌توان نشان داد
  if (assetsError || resourcesError) {
    return <Typography color="error">خطا در بارگذاری داده‌ها.</Typography>;
  }

  const handleEditChange = (assetId, field, value) => {
    setEditedData(prev => {
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
      const updates = Object.entries(editedData).map(([assetId, changes]) =>
        axios.patch(`http://localhost:5000/api/assets/${assetId}`, changes)
      );
      await Promise.all(updates);
      setEditedData({});
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const openDeleteDialog = asset => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAsset) return;
    try {
      await axios.delete(`http://localhost:5000/api/assets/${selectedAsset._id}`);
      await axios.delete(`http://localhost:5000/api/responsibility/${selectedAsset._id}`);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting asset or responsibilities:", error);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 50, align: "center", headerAlign: "center" },
    { field: 'name', headerName: 'نام', width: 100, align: "center", headerAlign: "center" },
    { field: 'type', headerName: 'نوع', width: 100, align: "center", headerAlign: "center" },

    // پنج ستون عددی
    ...Array.from({ length: 5 }, (_, i) => ({
      field: `index${i + 1}`,
      headerName: `شاخص ${i + 1}`,
      width: 100,
      renderCell: ({ row }) => (
        <EditableCell
          type="number"
          value={
            editedData[row._id]?.[`index${i + 1}`] ??
            row.indices?.[`index${i + 1}`] ??
            ''
          }
          onChange={val => handleEditChange(row._id, `index${i + 1}`, val)}
        />
      ),
    })),

    // چهار ستون منبع
    ...Array.from({ length: 4 }, (_, i) => ({
      field: `resource${i + 1}`,
      headerName: `منبع ${i + 1}`,
      width: 130,
      renderCell: ({ row }) => (
        <EditableCell
          type="select"
          value={
            editedData[row._id]?.[`resource${i + 1}`] ??
            row.resources?.[`resource${i + 1}`] ??
            ''
          }
          onChange={val => handleEditChange(row._id, `resource${i + 1}`, val)}
          resourcesList={resourcesList}
        />
      ),
    })),

    {
      field: 'action',
      headerName: "عملیات",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Button variant="contained" color="error" onClick={() => openDeleteDialog(row)}>
          حذف
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>همه‌ی دارایی‌ها</Typography>
      <DataGrid
        rows={assets}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[8, 16, 24]}
        pagination
        onPageSizeChange={newSize => setPageSize(newSize)}
        getRowId={row => row._id}
        autoHeight
        sx={{
          "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
            fontFamily: '"Yekan Bakh", sans-serif',
          },
        }}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={saveEditedData}
          disabled={!hasChanges}
        >
          ذخیره تغییرات
        </Button>
      </Box>

      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>اخطار</DialogTitle>
        <DialogContent>مطمئنی که میخوای دارایی را حذف کنی؟</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>لغو</Button>
          <Button color="error" onClick={handleDelete}>حذف</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
