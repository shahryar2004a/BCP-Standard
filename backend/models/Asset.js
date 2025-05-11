// /backend/models/Asset.js
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  resources: {
    resource1: { type: String },
    resource2: { type: String },
    resource3: { type: String },
    resource4: { type: String }
  },
  indices: {
    index1: { type: Number  },
    index2: { type: Number  },
    index3: { type: Number  },
    index4: { type: Number  },
    index5: { type: Number  }
  },
  raciMatrix: {
    responsible: { type: mongoose.Schema.Types.ObjectId, required:false, ref: 'Employee' }, // مرجع به کارمند مسئول
    support: { type: mongoose.Schema.Types.ObjectId, required:false, ref: 'Employee' }, // مرجع به کارمند پشتیبانی
    consulted: { type: mongoose.Schema.Types.ObjectId, required:false, ref: 'Employee' }, // مرجع به کارمند مشورت‌دهنده
    informed: { type: mongoose.Schema.Types.ObjectId, required:false, ref: 'Employee' } // مرجع به کارمند آگاه‌شده
  },

  createdAt: { type: Date, default: Date.now }, // تاریخ ایجاد
  updatedAt: { type: Date, default: Date.now } // تاریخ به‌روزرسانی
});

module.exports = mongoose.model('Asset', assetSchema);
