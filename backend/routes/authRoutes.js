// /backend/routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // مدل کاربر
const router = express.Router();
const jwt = require('jsonwebtoken');


router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  try {
    // بررسی وجود کاربر با ایمیل
    const user = await User.findOne({ email });
   

    if (!user) {
      return res.status(400).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }
    const cleanPassword = password.trim();
    
       


       console.log(user)
      console.log("Entered password:", password,"type : ",typeof password);  // پسورد وارد شده
      console.log("Stored hashed password:", user.pass,"type: ",typeof user.pass);  // پسورد هش شده در دیتابیس
    
    
    const isMatch = await bcrypt.compare(password,user.pass)
   
    if (!isMatch) {
      console.log('password is NOT match');
      return res.status(400).json({ message: 'رمز عبور اشتباه است' });
    } else {
      console.log('password is match');
      
    }
      

    // ساختن یک توکن JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, admin: user.admin },
      'secretkey', // کلید محرمانه سخت‌کد شده
      { expiresIn: '1h' }
    );

    // ارسال اطلاعات user و توکن به کلاینت
    res.status(200).json({
      message: 'ورود موفق',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      },
      token, // ارسال توکن
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'خطای سرور' });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password,admin } = req.body;

  // بررسی داده‌های ورودی
  if (!name || !email || !password ) {
    return res.status(400).json({ message: "همه فیلدها الزامی هستند." });
  }
 console.log(name,email,password,admin)
  try {
    // بررسی اینکه آیا کاربر قبلاً ثبت‌نام کرده است
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "این ایمیل قبلاً ثبت‌نام شده است." });
    }

    // هش کردن رمز عبور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ذخیره کاربر جدید در دیتابیس
    const newUser = new User({
      name,
      email,
      pass: hashedPassword,
      admin,
    });

    await newUser.save();
    res.status(201).json({ message: "ثبت‌نام با موفقیت انجام شد." });
  } catch (error) {
    console.error("خطا در ثبت‌نام:", error);
    res.status(500).json({ message: "خطا در سرور." });
  }
});


router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "کاربری یافت نشد" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // متغیر محیطی برای ایمیل
        pass: process.env.EMAIL_PASS,  // متغیر محیطی برای پسورد
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: user.email,
      subject: "بازنشانی رمز عبور",
      html: `<p>برای تغییر رمز عبور کلیک کنید:</p>
             <a href="http://localhost:3000/reset-password/${token}">بازنشانی رمز عبور</a>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "ایمیل ارسال شد" });
  } catch (err) {
    res.status(500).json({ message: "خطا در ارسال ایمیل" });
  }
});

// تأیید توکن و ذخیره رمز عبور جدید
router.post("/reset-password/confirm", async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "توکن نامعتبر است" });

    const salt = await bcrypt.genSalt(10);
    user.pass = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "رمز عبور تغییر کرد" });
  } catch (err) {
    res.status(500).json({ message: "خطا در تغییر رمز عبور" });
  }
});


module.exports = router;
