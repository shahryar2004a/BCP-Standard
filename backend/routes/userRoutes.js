// /backend/routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// دریافت تمامی کاربران
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ایجاد کاربر جدید
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    pass: req.body.pass,
    pic: req.body.pic,
    admin: req.body.admin,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// دریافت اطلاعات کاربر
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'کاربر پیدا نشد' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات' });
  }
});

// به روزرسانی یک کاربر
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, pass } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // به‌روزرسانی اطلاعات کاربر
    user.name = name;
    user.email = email;
    if (pass) {
      // هش کردن رمز عبور در صورت وجود
      user.pass = await bcrypt.hash(pass, 10);
    }

    await user.save();
    res.status(200).json({ message: 'اطلاعات با موفقیت به‌روزرسانی شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطایی رخ داد', error });
  }
});
// حذف یک کاربر
router.delete('/:id', getUser, async (req, res) => {
  try {
   
   const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post('/check-password', async (req, res) => {
  const { userId, currentPassword } = req.body;

  try {
    // پیدا کردن کاربر بر اساس userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // مقایسه رمز عبور فعلی ارسالی با رمز عبور ذخیره شده
    const isMatch = await bcrypt.compare(currentPassword, user.pass);  // استفاده از 'user.pass'
    if (isMatch) {
     console.log('password is match')
    }else{
      return res.status(400).json({ message: 'رمز عبور فعلی اشتباه است' });
    }

    // در صورتی که رمز عبور صحیح باشد
    res.status(200).json({ valid: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در بررسی رمز عبور' });
  }
});



router.put('/change-password/:id', async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.newPassword);
  const {  newPassword } = req.body;
  const  userId  = req.params.id;
  
  try {
    // پیدا کردن کاربر با ID
    console.log("userID: ",userId);
    const user = await User.findById(userId);
    console.log("user: ",user);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

   
    // هش کردن رمز عبور جدید و ذخیره آن
    const salt = await bcrypt.genSalt(10);
    console.log("salt: ", salt);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.pass = hashedPassword;

  console.log("hashedPassword: ", hashedPassword);
  console.log('user password: ',user.pass)
    // ذخیره تغییرات در دیتابیس
    await user.save();

    res.status(200).json({ message: 'رمز عبور با موفقیت تغییر کرد' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطا در تغییر رمز عبور' });
  }
});

// Middleware برای پیدا کردن کاربر
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

router.put('/:id/make-admin', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'کاربر پیدا نشد' });

    user.admin = true; // تغییر نقش به ادمین
    await user.save();
    res.json({ message: 'کاربر با موفقیت ادمین شد', user });
  } catch (err) {
    res.status(500).json({ message: 'خطا در تغییر نقش کاربر', error: err.message });
  }
});


module.exports = router;
