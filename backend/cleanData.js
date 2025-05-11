const mongoose = require('mongoose');
const Employee = require('./models/Employee'); // مسیر صحیح مدل Employee

const cleanEmployeeData = async () => {
  try {
    // اتصال به دیتابیس
    await mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to database.');

    // دریافت و تمیز کردن داده‌های کارمندان
    const employees = await Employee.find();
    employees.forEach(async employee => {
      if (!employee.responsibilities || typeof employee.responsibilities !== 'object') {
        employee.responsibilities = {}; // مقداردهی پیش‌فرض
      } else {
        for (const key in employee.responsibilities) {
          if (!Array.isArray(employee.responsibilities[key])) {
            employee.responsibilities[key] = []; // تبدیل به آرایه خالی
          }
        }
      }
      await employee.save(); // ذخیره تغییرات
    });

    console.log('Employee data cleaned successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error cleaning employee data:', error);
    mongoose.connection.close();
  }
};

cleanEmployeeData();
