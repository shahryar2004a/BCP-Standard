const xlsx = require('xlsx');
const path = require('path');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const Resource = require('../models/Resource');

exports.processExcelFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('فایلی آپلود نشده است.');
  }

  const fileExtension = path.extname(req.file.originalname);
  if (fileExtension !== '.xlsx' && fileExtension !== '.xls') {
    return res.status(400).send('فقط فایل‌های اکسل مجاز هستند.');
  }

  try {
    console.log('شروع پردازش فایل...');
    const workbook = xlsx.readFile(req.file.path);
    console.log('فایل خوانده شد.');

    const sheetNames = workbook.SheetNames;
    console.log('نام شیت‌ها:', sheetNames);

    // پردازش شیت‌ها
    for (const sheetName of sheetNames) {
      console.log(`در حال پردازش شیت: ${sheetName}`);
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // ذخیره داده‌های Assets
      if (sheetName === 'Assets') {
        console.log('در حال ذخیره داده‌های Assets...');
        for (const item of sheetData) {
          // بررسی اینکه آیا دارایی قبلاً موجود است
          const existingAsset = await Asset.findOne({ name: item.name });
          if (!existingAsset) {
            const asset = new Asset({
              name: item.name,
              type: item.type,
              resources: {
                resource1: item.resource1,
                resource2: item.resource2,
                resource3: item.resource3,
                resource4: item.resource4,
              },
              indices: {
                index1: item.index1,
                index2: item.index2,
                index3: item.index3,
                index4: item.index4,
                index5: item.index5,
              },
            });

            await asset.save();
            console.log(`دارایی ${item.name} با موفقیت ذخیره شد.`);
          } else {
            console.log(`دارایی ${item.name} قبلاً در دیتابیس موجود است.`);
          }
        }
      }

      // ذخیره داده‌های Employees
      else if (sheetName === 'Employees') {
        console.log('در حال ذخیره داده‌های Employees...');
        for (const item of sheetData) {
          // بررسی اینکه آیا کارمند قبلاً موجود است
          const existingEmployee = await Employee.findOne({ email: item.email });
          if (!existingEmployee) {
            const employee = new Employee({
              firstName: item.firstName,
              lastName: item.lastName,
              phone: item.phone,
              email: item.email,
              address: item.address,
              emergencyStatus: item.emergencyStatus,
              department: item.department,
              responsibilities: {
                responsibility: 'no responsibility',
              },
            });

            await employee.save();
            console.log(`کارمند ${item.firstName} ${item.lastName} با موفقیت ذخیره شد.`);
          } else {
            console.log(`کارمند ${item.firstName} ${item.lastName} قبلاً در دیتابیس موجود است.`);
          }
        }
      }

      // پردازش شیت Resources
      else if (sheetName === 'Resources') {
        console.log('در حال ذخیره داده‌های Resources...');
        for (const item of sheetData) {
          // بررسی اینکه آیا منبع قبلاً موجود است
          const existingResource = await Resource.findOne({ name: item.name });
          if (!existingResource) {
            const resource = new Resource({
              name: item.name,
              type: item['type '.trim()] || 'default',  // حذف فاصله اضافی
              description: item.description,
              quantity: item.quantity || 0,
            });

            await resource.save();
            console.log(`منبع ${item.name} با موفقیت ذخیره شد.`);
          } else {
            console.log(`منبع ${item.name} قبلاً در دیتابیس موجود است.`);
          }
        }
      }
    }

    res.status(200).send('اطلاعات با موفقیت ذخیره شد.');
  } catch (err) {
    console.error('خطا در پردازش فایل:', err);
    res.status(500).send('خطا در پردازش فایل.');
  }
};
