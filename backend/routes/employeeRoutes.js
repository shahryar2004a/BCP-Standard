// /backend/routes/employeeRoutes.js
const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// دریافت تمامی کارمندان
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({
      data: employees,
      message:'OK'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});








// ایجاد کارمند جدید
router.post('/', async (req, res) => {
  const employee = new Employee({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    emergencyStatus: req.body.emergencyStatus,
    department: req.body.department,
    responsibility: req.body.responsibility,
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// دریافت یک کارمند خاص
router.get('/:id', getEmployee,async  (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err });
  }
});

// به روزرسانی یک کارمند
router.put('/:id', getEmployee, async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Error updating employee", error: err });
  }
});



router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { replace1 ,replace2,replace3 } = req.body;

  try {
    const updates = {};

    // به‌روزرسانی raciMatrix
    if (replace1 != null) updates["replacements.replace1"] = replace1;
    if (replace2 != null) updates["replacements.replace2"] = replace2;
    if (replace3 != null) updates["replacements.replace3"] = replace3;





    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Asset not found" });
    }

    console.log("Updates applied:", updates);
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ message: "Server Error" });
  }
});






// حذف یک کارمند
router.delete('/:id', getEmployee, async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully", deletedEmployee });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee", error: err });
  }
});

// Middleware برای پیدا کردن کارمند
async function getEmployee(req, res, next) {
  let employee;
  try {
    employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({ message: 'Cannot find employee' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.employee = employee;
  next();
}

module.exports = router;
