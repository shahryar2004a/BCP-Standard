import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography,TextField,Tabs,Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, useNavigate } from 'react-router-dom';

export default function Home() {
  const [assets, setAssets] = useState([]); // دارایی‌ها
  const [employees, setEmployees] = useState([]);
  const [resources,setResources]=useState()
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری
  const [activeTab,setActiveTab]=useState(0)
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // فعال کردن تب بر اساس URL
    const tabIndex = parseInt(new URLSearchParams(location.search).get('tab') || '0');
    setActiveTab(tabIndex);
  }, [location]);


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // تغییر URL برای تنظیم تب فعال
    navigate(`?tab=${newValue}`);
  };

  useEffect(() => {
    // بارگذاری دارایی‌ها از دیتابیس
    axios
      .get("http://localhost:5000/api/assets")
      .then((response) => {
        setAssets(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
        setLoading(false);
      });
      axios
      .get("http://localhost:5000/api/resources")
      .then((response) => {
        setResources(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
        setLoading(false);
      });

      axios
      .get("http://localhost:5000/api/employees")
      .then((response) => {
       setEmployees(response.data.data);
       setLoading(false)
      })
      .catch((error) => {
        console.error("Error  fetching employees:", error);
        setLoading(false);
      })


  }, []);


    useEffect(() => {
      // فعال کردن تب بر اساس URL
      const tabIndex = parseInt(new URLSearchParams(location.search).get('tab') || '0');
      setActiveTab(tabIndex);
    }, [location]);


    

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
    
      <Box>
      <h1 className="text-blue-500 text-center text-4xl">BCP STANDARD</h1>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="دارایی ها"/>
        <Tab  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="کارمندان"/>
      </Tabs>
     
        {activeTab === 0 && (
       <Box>
        <Typography  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="h6">همه‌ی دارایی‌ها</Typography>
        <DataGrid
          rows={assets}
          columns={[
            {
              field: "_id",
              headerName: "ID",
              width: 50,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "name",
              headerName: "نام",
              width: 150,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "type",
              headerName: "نوع",
              width: 100,
              align: "center",
              headerAlign: "center",
            },
            ...Array.from({ length: 5 }, (_, i) => ({
            field: `index${i + 1}`,
            headerName: `شاخص  ${i + 1}`,
            width: 100,
            renderCell: (params) => (
              <TextField
                type="number"
                size="small"
                value={params.row.indices?.[`index${i + 1}`]}
              />
            ),
          })),
            ...Array.from({ length: 4 }, (_, i) => ({
              field: `resources.resource${i + 1}`,
              headerName: `منبع ${i + 1}`,
              width: 130,
              renderCell: (params) => (
                <TextField
                  type="text"
                  size="small"
                  value={params.row.resources?.[`resource${i + 1}`]}
                />
              ),
              align: "center",
              headerAlign: "center",
            })),
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
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
         </Box>
        )}

            
{activeTab === 1 && (
       <Box>
        <Typography  sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} variant="h6">همه‌ی کارمندان</Typography>
        <DataGrid
          rows={employees}
          columns={[
            {
              field: "_id",
              headerName: "ID",
              width: 50,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "firstName",
              headerName: "نام",
              width: 100,
              align: "center",
              headerAlign: "center",
            },
            {
              field: "lastName",
              headerName: "نام خانوادگی",
              width: 100,
              align: "center",
              headerAlign: "center",
            },
           
            { field: "phone", headerName: "تلفن", width: 150, align: "center", headerAlign: "center" },
            { field: "email", headerName: "ایمیل", width: 150, align: "center", headerAlign: "center" },
            { field: "address", headerName: "آدرس", width: 200, align: "center", headerAlign: "center" },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
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
         </Box>
        )}
      </Box>
    </div>
  );
}
