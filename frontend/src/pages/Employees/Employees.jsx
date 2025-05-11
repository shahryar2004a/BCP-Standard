import React, { useState,useEffect } from 'react';
import { Tabs,Tab,Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import EmployeesTab from '../../components/EmployeesTabs/EmployeesTab';
import NewEmployee from "../NewEmployee/NewEmployee";

export default function Employees() {
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
  
  return (
<div className='w-[100%]'>
    
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="کارمندان"/>
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }} label="کارمند جدید"/>
      </Tabs>
      <Box p={2}>
         {activeTab===0 && (
          <EmployeesTab/>
         )}
         {activeTab === 1 && (

         <NewEmployee/>

         )}

      </Box>
    </Box>
    </div>
  )
}
