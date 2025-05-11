import React, { useState,useEffect } from 'react';
import { Tabs,Tab,Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import AssetsTab from '../../components/AssetsTabs/AssetsTab';
import PrioritizedAssetsTab from '../../components/AssetsTabs/PrioritizedAssetsTab';
import NewAsset from "../../pages/NewAsset/NewAsset"
const Assets = () => {
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
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}  label="دارایی ها"/>
        <Tab label="RACI Matrix"/>
        <Tab sx={{ fontFamily: '"Yekan Bakh", sans-serif' }}  label="دارایی جدید"/>
      </Tabs>
      <Box p={2}>
         {activeTab===0 && (
          <AssetsTab/>
         )}
         {activeTab === 1 && (

          <PrioritizedAssetsTab/>

         )}
          {activeTab === 2 && (
      
        <NewAsset/>

          )}
      </Box>
    </Box>
    </div>

  );
}


export default Assets;
