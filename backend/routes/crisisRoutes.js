const express = require('express');
const router = express.Router();
const Responsibility = require('../models/responsibility');
const Employee = require('../models/Employee');

// API برای دریافت کارمندان براساس سطح مسئولیت
router.get('/', async (req, res) => {
  try {
    // 1. محاسبه تعداد مسئولیت‌ها برای هر کارمند
    const employeeResponsibilities = await Responsibility.aggregate([
      {
        $group: {
          _id: '$employeeId', // گروه‌بندی براساس آیدی کارمند
          totalResponsibilities: { $sum: 1 }, // شمارش تعداد مسئولیت‌ها
        },
      },
      { $sort: { totalResponsibilities: -1 } }, // مرتب‌سازی براساس تعداد مسئولیت
    ]);

    // 2. استخراج آیدی‌های کارمندان
    const employeeIds = employeeResponsibilities.map((item) => item._id);

    // 3. دریافت اطلاعات کارمندان براساس آیدی
    const employees = await Employee.find({ _id: { $in: employeeIds } }).lean();

    // 4. ترکیب اطلاعات کارمندان و تعداد مسئولیت‌ها
    const employeeData = employeeResponsibilities.map((item) => {
      const employee = employees.find((emp) => emp._id.toString() === item._id.toString());
      return {
        employeeId: item._id,
        firstName: employee?.firstName || 'Unknown',
        lastName: employee?.lastName || 'Unknown',
        phone: employee?.phone || 'Unknown',
        address: employee?.address || 'Unknown',
        email: employee?.email || 'Unknown',
        replacements:employee.replacements || {},
        totalResponsibilities: item.totalResponsibilities,
      };
    });

    // 5. تقسیم کارمندان به 5 سطح براساس درصد و با تکرار افراد در سطوح بعدی
    const totalEmployees = employeeData.length;

    // محاسبه حدود درصدها
    const level1Index = Math.ceil(totalEmployees * 0.2);
    const level2Index = Math.ceil(totalEmployees * 0.4);
    const level3Index = Math.ceil(totalEmployees * 0.6);
    const level4Index = Math.ceil(totalEmployees * 0.8);

    const levels = {
      level1: employeeData.slice(0, level1Index),
      level2: employeeData.slice(0, level2Index),
      level3: employeeData.slice(0, level3Index),
      level4: employeeData.slice(0, level4Index),
      level5: employeeData, // همه افراد در لول ۵ قرار می‌گیرند
    };

    res.json(levels);
  } catch (error) {
    console.error('Error fetching employees by responsibility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
