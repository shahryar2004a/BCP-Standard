import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // مقدار ثابت برای کاربر لاگین‌شده
  const loggedInUser = useMemo(() => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }, []);

  // گرفتن کاربران از API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!loggedInUser || !loggedInUser.id) return;
        const response = await axios.get('http://localhost:5000/api/users');
        const filteredUsers = response.data.filter(user => user._id !== loggedInUser.id);
        setUsers(filteredUsers);
        setLoading(false);
      } catch (err) {
        setError('خطا در بارگذاری داده‌ها');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  // حذف یک کاربر
  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('خطا در حذف کاربر');
    }
  };

  // تغییر نقش کاربر به ادمین
  const makeAdmin = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/make-admin`);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, admin: true } : user
        )
      );
    } catch (err) {
      setError('خطا در تغییر نقش کاربر');
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const rows = users.map((user) => ({
    ...user,
    type: user.admin ? 'admin' : 'normal',
  }));

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'نام', width: 200 },
    { field: 'email', headerName: 'ایمیل', width: 300 },
    { field: 'type', headerName: 'نوع کاربر', width: 150 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            color="error"
            onClick={() => handleOpenDeleteDialog(params.row)}
          >
            حذف
          </Button>
          {!params.row.admin && (
            <Button
              color="primary"
              onClick={() => makeAdmin(params.row._id)}
            >
              تبدیل به ادمین
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className='font-medium' style={{ height: 400, width: '100%' }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          getRowId={(row) => row._id}
          sx={{
            '& .MuiDataGrid-cell': {
              fontFamily: '"Yekan Bakh", sans-serif',
            },
            '& .MuiDataGrid-columnHeader': {
              fontFamily: '"Yekan Bakh", sans-serif',
            },
          }}
        />
      )}

      {/* دیالوگ تایید حذف */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle className='font-yekanBakh'>اخطار</DialogTitle>
        <DialogContent>مطمئنی که میخوای این کاربر را حذف کنی؟</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>لغو</Button>
          <Button color="error" onClick={deleteUser}>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
