import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Tab, Tabs, Typography } from "@mui/material";

function CrisisLevel() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [levelsData, setLevelsData] = useState({});
  const [employeeMap, setEmployeeMap] = useState({});

  // دریافت داده‌های کارمندان از API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/employees-by-responsibility")
      .then((response) => {
        setLevelsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });

    // دریافت اطلاعات کامل کارمندان
    axios
      .get("http://localhost:5000/api/employees")
      .then((response) => {
        const map = {};
        response.data.data.forEach((employee) => {
          map[employee._id] = `${employee.firstName} ${employee.lastName}`;
        });
        setEmployeeMap(map);
      })
      .catch((error) => {
        console.error("Error fetching all employees:", error);
      });
  }, []);

  // نام سطح فعلی
  const currentLevelKey = `level${selectedTab + 1}`;

  // داده‌های مربوط به تب فعلی
  const displayedEmployees = levelsData[currentLevelKey] || [];

  // ستون‌ها برای DataGrid
  const columns = [
    {
      field: "fullName",
      headerName: "نام",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "تلفن",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "آدرس",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "ایمیل",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "replacements",
      headerName: "جایگزین",
      width: 300,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!employeeMap || Object.keys(employeeMap).length === 0) {
          return "در حال بارگذاری...";
        }
        const replacements = params.row.replacements || {};
        const names = Object.values(replacements)
          .map((id) => employeeMap[id])
          .filter((name) => name)
          .join(", ");
      
        return names || "ندارد";
      },
    },
    {
      field: "totalResponsibilities",
      headerName: "تعداد مسئولیت ها",
      width: 200,
      align: "center",
      headerAlign: "center",

    },
  ];

  // ردیف‌ها برای DataGrid
  const rows = displayedEmployees.map((employee, index) => ({
    id: employee.employeeId || index,
    fullName: `${employee.firstName} ${employee.lastName}`,
    phone: employee.phone || "N/A",
    address: employee.address || "N/A",
    email: employee.email || "N/A",
    replacements: employee.replacements || {}, // مقدار پیش‌فرض
    totalResponsibilities: employee.totalResponsibilities,
    
  }));

  return (
    <Box>
      {/* تب‌ها */}
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
      >
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="سطح 1" />
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="سطح 2" />
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="سطح 3" />
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="سطح 4" />
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="سطح 5" />
      </Tabs>

      <Typography sx={{ fontFamily: '"Yekan Bakh", sans-serif' ,mt: 2, mb: 2 }} variant="h6" >
        کارمندان در بحران سطح {selectedTab + 1}
      </Typography>

      {/* نمایش DataGrid */}
      <div style={{ height: 800, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          sx={{
            '& .MuiDataGrid-cell': {
              fontFamily: '"Yekan Bakh", sans-serif', // اعمال فونت به تمام سلول‌ها
            },
            '& .MuiDataGrid-columnHeader': {
              fontFamily: '"Yekan Bakh", sans-serif', // اعمال فونت به سرستون‌ها
            },
          }}
        />
      </div>
    </Box>
  );
}

export default CrisisLevel;
