// /backend/routes/assetRoutes.js
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Asset = require('../models/Asset');

const router = express.Router();
const upload =multer({dest:'uploads/'})



// دریافت تمامی دارایی‌ها
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find()
    res.json({
      data:assets,
      message:'OK'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ایجاد دارایی جدید
router.post('/', async (req, res) => {
  const asset = new Asset({
    name: req.body.name,
    type: req.body.type,
    resources: req.body.resources,
    indices: req.body.indices,
    raciMatrix: req.body.raciMatrix,
  });

  try {
    const newAsset = await asset.save();
    res.status(201).json(newAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// دریافت یک دارایی خاص
router.get('/:id', getAsset,async (req, res) => {
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

// به روزرسانی یک دارایی
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { responsible, consulted, informed, support, index1,index2,index3,index4,index5,resource1,resource2,resource3,resource4 } = req.body;

  try {
    const updates = {};

    // به‌روزرسانی raciMatrix
    if (responsible != null) updates["raciMatrix.responsible"] = responsible;
    if (consulted != null) updates["raciMatrix.consulted"] = consulted;
    if (informed != null) updates["raciMatrix.informed"] = informed;
    if (support != null) updates["raciMatrix.support"] = support;
 
    if (index1 != null) updates["indices.index1"] = index1;
    if (index2 != null) updates["indices.index2"] = index2;
    if (index3 != null) updates["indices.index3"] = index3;
    if (index4 != null) updates["indices.index4"] = index4;
    if (index5 != null) updates["indices.index5"] = index5;


    if (resource1 != null) updates["resources.resource1"] = resource1;
    if (resource2 != null) updates["resources.resource2"] = resource2;
    if (resource3 != null) updates["resources.resource3"] = resource3;
    if (resource4 != null) updates["resources.resource4"] = resource4;




    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    console.log("Updates applied:", updates);
    res.json(updatedAsset);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// حذف یک دارایی
router.delete('/:id', getAsset, async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);

    if (!deletedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({ message: "Asset deleted successfully", deletedAsset });
  } catch (err) {
    res.status(500).json({ message: "Error deleting asset", error: err });
  }
});

// Middleware برای پیدا کردن دارایی
async function getAsset(req, res, next) {
  let asset;
  try {
    asset = await Asset.findById(req.params.id);
    if (asset == null) {
      return res.status(404).json({ message: 'Cannot find asset' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.asset = asset;
  next();
}

module.exports = router;
