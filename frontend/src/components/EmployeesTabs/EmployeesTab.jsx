import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [responsibilitiesData, setResponsibilitiesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [editedData, setEditedData] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, responsibilitiesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/employees"),
          axios.get("http://localhost:5000/api/responsibility"),
        ]);
        setEmployees(employeesRes.data.data || []);
        setResponsibilitiesData(responsibilitiesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openDeleteDialog = (employee) => {
    if (employee) {
      setSelectedEmployee(employee);
      setDeleteDialogOpen(true);
    } else {
      console.error("No employee selected for deletion");
    }
  };

  const handleEditChange = (assetId, field, value) => {
    setEditedData((prev) => {
      const updated = {
        ...prev,
        [assetId]: {
          ...prev[assetId],
          [field]: value,
        },
      };
      console.log(updated);
      setHasChanges(true);
      return updated;
    });
  };



  const saveEditedData = async () => {
    try {
      const updates = Object.entries(editedData).map(async ([employeeId, changes]) => {
        console.log("employeeId: ",employeeId,"changes: ",changes)
        await axios.patch(`http://localhost:5000/api/employees/${employeeId}`, changes);
      });

      await Promise.all(updates);

      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data.data);
      setEditedData({});
      setHasChanges(false);
      console.log("Changes saved successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  const handleDelete = async (event) => {
    if (event) event.preventDefault();

    if (!selectedEmployee || !selectedEmployee._id) {
      console.error("No selected employee to delete");
      return;
    }

    try {
      setLoading(true);

      // بررسی وجود مسئولیت‌ها
      const responsibilitiesForEmployee = responsibilitiesData.filter(
        (responsibility) => responsibility.employeeId?._id === selectedEmployee._id
      );

      if (responsibilitiesForEmployee.length > 0) {
        // حذف مسئولیت‌های مرتبط با کارمند
        await axios.delete(
          `http://localhost:5000/api/responsibility/employee/${selectedEmployee._id}`
        );
      }

      // حذف کارمند
      await axios.delete(
        `http://localhost:5000/api/employees/${selectedEmployee._id}`
      );

      setEmployees((prev) =>
        prev.filter((employee) => employee._id !== selectedEmployee._id)
      );
      setResponsibilitiesData((prev) =>
        prev.filter(
          (responsibility) =>
            responsibility.employeeId?._id !== selectedEmployee._id
        )
      );

      setDeleteDialogOpen(false);
      setSelectedEmployee(null);

      console.log("Employee and responsibilities deleted successfully");
    } catch (error) {
      console.error("Error deleting employee and responsibilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getResponsibilities = (employeeId) => {
    const responsibilities = responsibilitiesData
      .filter((responsibility) => responsibility.employeeId?._id === employeeId)
      .map((responsibility) => ({
        assetName: responsibility.assetId?.name || "نامشخص",
        roles: responsibility.responsibilities.join(", "),
      }));

    return responsibilities
      .map((item) => `${item.assetName} (${item.roles})`)
      .join(", ");
  };

  const rows = employees.map((employee) => ({
    ...employee,
    fullName: `${employee.firstName} ${employee.lastName}`, // ترکیب نام و نام خانوادگی
    responsibilitiesText: getResponsibilities(employee._id),
  }));

  const columns = [
    { field: "fullName", headerName: "نام", width: 100, align: "center", headerAlign: "center" },
    { field: "phone", headerName: "تلفن", width: 150, align: "center", headerAlign: "center" },
    { field: "email", headerName: "ایمیل", width: 150, align: "center", headerAlign: "center" },
    { field: "address", headerName: "آدرس", width: 200, align: "center", headerAlign: "center" },
    {
      field: "responsibilitiesText",
      headerName: "مسئولیت‌ها",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const responsibilities = params.value ? params.value.split(", ") : [];
        return responsibilities.length > 0 ? (
          <Select value={responsibilities[0]} fullWidth displayEmpty sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>
            {responsibilities.map((responsibility, index) => (
              <MenuItem key={index} value={responsibility} sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>
                {responsibility}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="body2">بدون مسئولیت</Typography>
        );
      },
    },
      ...Array.from({ length: 3 }, (_, i) => ({
            field: `replace${i + 1}`,
            headerName: `جایگزین ${i + 1}`,
            width: 130,
            renderCell: (params) => (
              <Select
              sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
              value={
                editedData[params.row._id] && editedData[params.row._id][`replace${i + 1}`] !== undefined
                  ? editedData[params.row._id][`replace${i + 1}`]
                  : (params.row.resources && params.row.resources[`replace${i + 1}`]) || ''
              }
                onChange={(e) =>
                  handleEditChange(params.row._id, `replace${i + 1}`, e.target.value)
                }
                fullWidth
              >
                <MenuItem value="">None</MenuItem>
                {employees
                    .filter((employee) => employee._id !== params.row._id) // حذف کارمند جاری از لیست
                    .map((employee) => (
                      <MenuItem sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} key={employee._id} value={employee._id}>
                        {`${employee.firstName} ${employee.lastName}`}
                      </MenuItem>
                    ))}
              </Select>
            ),
          })),
    {
      field: "action",
      headerName: "عملیات",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="contained" color="error" onClick={() => openDeleteDialog(params.row)}>
          حذف
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="h6" gutterBottom>
        کارمندان
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        checkboxSelection
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
        <Button  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="contained" color="primary" onClick={saveEditedData} disabled={!hasChanges}>
              ذخیره تغییرات
         </Button>
      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>اخطار</DialogTitle>
        <DialogContent sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}>آیا مطمئن هستید که می‌خواهید این کارمند را حذف کنید؟</DialogContent>
        <DialogActions>
          <Button sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} onClick={() => setDeleteDialogOpen(false)}>لغو</Button>
          <Button
            type="button"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}
          >
            {loading ? <CircularProgress size={20} /> : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
};

export default Employees;
