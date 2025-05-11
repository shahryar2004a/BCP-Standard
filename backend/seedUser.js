const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // مسیر مدل کاربر

// اتصال به دیتابیس
mongoose.connect('mongodb://localhost:27017/BCP_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// کاربران نمونه
const users = [
  { name: 'Admin User', email: 'admin@gmail.com', pass: '123', admin: true },
  { name: 'User One', email: 'user1@gmail.com', pass: '123', admin: false },
  { name: 'User Two', email: 'user2@gmail.com', pass: '123', admin: false },
  { name: 'User Three', email: 'user3@gmail.com', pass: '123', admin: false },
];

// افزودن کاربران به دیتابیس
const seedUsers = async () => {
  try {
    for (const user of users) {
          const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.pass, salt);
      const newUser = new User({ ...user, pass: hashedPassword });
      await newUser.save();
      console.log(`User ${newUser.name} created`);
    }
    console.log('All users created successfully');
  } catch (err) {
    console.error('Error creating users:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();
