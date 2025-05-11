// /backend/routes/employeeRoutes.js
const express = require('express');
const Responsibility = require('../models/responsibility');
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const responsibilities = await Responsibility.find()
      .populate('employeeId', 'firstName lastName') // نمایش اطلاعات کارمند
      .populate('assetId', 'name'); // نمایش اطلاعات دارایی
    res.json({
      data: responsibilities,
      message: 'OK'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

  router.get("/:id", async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.status(200).json(asset);
  } catch (err) {
    res.status(500).json({ message: "Error fetching asset", error: err });
  }
  });


  router.get("/employee/:employeeId", async (req, res) => {
    const { employeeId } = req.params;
  
    try {
      const responsibilities = await Responsibility.find({ employeeId })
      
  
      if (responsibilities.length === 0) {
        return res.status(404).json({ message: "No responsibilities found for this employee" });
      }
  
      res.status(200).json(responsibilities);
    } catch (error) {
      console.error("Error fetching responsibilities:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });


  router.post("/", async (req, res) => {
    const { assetId, employeeId, responsibilities } = req.body;
  
    // بررسی وجود داده‌های مورد نیاز
    if (!assetId || !employeeId || !responsibilities || responsibilities.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // بررسی اعتبار مقادیر responsibilities
    const validResponsibilities = ['responsible', 'consulted', 'informed', 'support'];
    if (!responsibilities.every(res => validResponsibilities.includes(res))) {
      return res.status(400).json({ message: "Invalid values in responsibilities" });
    }
  
    try {
      // ساخت شیء جدید Responsibility
      const newResponsibility = new Responsibility({
        assetId,
        employeeId,
        responsibilities,  // اضافه کردن آرایه responsibilities
      });
  
      // ذخیره مسئولیت جدید در دیتابیس
      await newResponsibility.save();
  
      // ارسال پاسخ موفق
      res.status(201).json(newResponsibility);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
  


  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { responsibilities } = req.body;
  
    try {
      if (!responsibilities || responsibilities.length === 0) {
        return res.status(400).json({ message: "Invalid responsibilities data" });
      }
  
      const updatedResponsibility = await Responsibility.findByIdAndUpdate(
        id,
        { $set: { responsibilities } },
        { new: true }
      );
  
      if (!updatedResponsibility) {
        return res.status(404).json({ message: "Responsibility not found" });
      }
  
      res.status(200).json(updatedResponsibility);
    } catch (error) {
      console.error("Error updating responsibility:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.delete('/employee/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    try {
      // یافتن مسئولیت‌ها بر اساس شناسه کارمند
      const responsibilities = await Responsibility.find({ employeeId });
      if (!responsibilities.length) {
        return res.status(404).send('No responsibilities found for this employee');
      }
      
      // حذف مسئولیت‌ها
      await Responsibility.deleteMany({ employeeId });
      res.status(200).send('Responsibilities deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting responsibilities');
    }
  });
  router.delete('/employee/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    try {
      // یافتن مسئولیت‌ها بر اساس شناسه کارمند
      const responsibilities = await Responsibility.find({ employeeId });
      if (!responsibilities.length) {
        return res.status(404).send('No responsibilities found for this employee');
      }
      
      // حذف مسئولیت‌ها
      await Responsibility.deleteMany({ employeeId });
      res.status(200).send('Responsibilities deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting responsibilities');
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const assetId = req.params.id; // دریافت آیدی دارایی از پارامتر URL
  
      // حذف تمامی رکوردهای مرتبط با آیدی دارایی
      const deletedResponsibilities = await Responsibility.deleteMany({ assetId });
  
      if (deletedResponsibilities.deletedCount === 0) {
        return res.status(404).json({ message: 'No responsibilities found for the given asset ID.' });
      }
  
      res.status(200).json({
        message: 'Responsibilities deleted successfully.',
        deletedCount: deletedResponsibilities.deletedCount,
      });
    } catch (error) {
      console.error('Error deleting responsibilities:', error);
      res.status(500).json({ error: 'Error deleting responsibilities.' });
    }
  });

module.exports = router;