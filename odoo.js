const express = require('express');
const router = express.Router();
const OdooData = require('../models/OdooData');
const verifyToken = require('../middleware/authMiddleware');

// Deetaa Odoo Galchuuf (Save Odoo Data)
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { recordId, modelName, data } = req.body;

    const newRecord = new OdooData({
      user: req.user.id,
      recordId,
      modelName,
      data
    });

    await newRecord.save();
    res.status(201).json({ message: "Deetaan Odoo milkaa'inaan galmeeffame!", data: newRecord });
  } catch (error) {
    res.status(500).json({ message: "Dogoggorri uumame", error: error.message });
  }
});

// Deetaa Odoo Hunda Argachuuf (Get All Odoo Records for User)
router.get('/records', verifyToken, async (req, res) => {
  try {
    const records = await OdooData.find({ user: req.user.id });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Dogoggorri uumame", error: error.message });
  }
});

module.exports = router;

