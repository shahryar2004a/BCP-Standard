import React, { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Topbar() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // دریافت نام کاربر از localStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setUserName(user.name); // فرض کنید که نام کاربر در ویژگی `name` ذخیره شده است
    }
  }, []);

  return (
    <div className='topbar font-yekanBakh w-full h-[50px] bg-white sticky top-0 z-50 m-4'>
      <div className='topbarWrapper flex justify-between items-center h-full pr-[20px] pl-[20px]'>
        <div className="topLeft">
          <span className='logo font-bold text-[30px] cursor-pointer text-blue-800'>
            {userName ? userName : ''}
          </span>
        </div>
        <div className="topRight flex items-center ml-5">
          <span className='logo font-bold text-[30px] cursor-pointer text-blue-800'>
            BCP STANDARD
          </span>
        </div>
      </div>
    </div>
  );
}
