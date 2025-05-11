const express = require('express');
const Resource = require('../models/Resource'); // فرض می‌کنیم مدل Resource در این مسیر قرار دارد
const router = express.Router();

// ایجاد منبع جدید
router.post('/', async (req, res) => {
  try {
    const { name, type, description, quantity } = req.body;

    const newResource = new Resource({
      name,
      type,
      description,
      quantity
    });

    await newResource.save(); // ذخیره منبع جدید در دیتابیس
    res.status(201).json({ message: 'منبع جدید با موفقیت ایجاد شد.', resource: newResource });
  } catch (error) {
    console.error('خطا در ایجاد منبع:', error);
    res.status(500).json({ message: 'خطا در ایجاد منبع' });
  }
});



// دریافت تمامی منابع
router.get('/', async (req, res) => {
    try {
      const resources = await Resource.find(); // تمام منابع را از دیتابیس می‌خوانیم
      res.status(200).json(resources);
    } catch (error) {
      console.error('خطا در دریافت منابع:', error);
      res.status(500).json({ message: 'خطا در دریافت منابع' });
    }
  });


  // دریافت منبع خاص با استفاده از id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const resource = await Resource.findById(id); // جستجو منبع با id مشخص
  
      if (!resource) {
        return res.status(404).json({ message: 'منبع یافت نشد' });
      }
  
      res.status(200).json(resource);
    } catch (error) {
      console.error('خطا در دریافت منبع:', error);
      res.status(500).json({ message: 'خطا در دریافت منبع' });
    }
  });

  

  // به‌روزرسانی منبع
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, description, quantity } = req.body;
  
    try {
      const updatedResource = await Resource.findByIdAndUpdate(
        id,
        { name, type, description, quantity },
        { new: true } // این گزینه باعث می‌شود که منبع به‌روزرسانی‌شده را برگرداند
      );
  
      if (!updatedResource) {
        return res.status(404).json({ message: 'منبع یافت نشد' });
      }
  
      res.status(200).json({ message: 'منبع با موفقیت به‌روزرسانی شد.', resource: updatedResource });
    } catch (error) {
      console.error('خطا در به‌روزرسانی منبع:', error);
      res.status(500).json({ message: 'خطا در به‌روزرسانی منبع' });
    }
  });

  

  // حذف منبع
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedResource = await Resource.findByIdAndDelete(id); // حذف منبع با id مشخص
  
      if (!deletedResource) {
        return res.status(404).json({ message: 'منبع یافت نشد' });
      }
  
      res.status(200).json({ message: 'منبع با موفقیت حذف شد.' });
    } catch (error) {
      console.error('خطا در حذف منبع:', error);
      res.status(500).json({ message: 'خطا در حذف منبع' });
    }
  });
  
module.exports = router;
