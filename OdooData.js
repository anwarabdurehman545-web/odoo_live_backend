const mongoose = require('mongoose');

const odooDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordId: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: true // Fkn: res.partner, sale.order, ijoof
  },
  data: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OdooData', odooDataSchema);

