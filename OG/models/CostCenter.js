const mongoose = require('mongoose');

const costCenterSchema = new mongoose.Schema({
  costCenterCode: { type: String }, // not unique due to shared use
  costCenterName: String,
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
  sectors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sector' }]
});

module.exports = mongoose.models.CostCenter || mongoose.model('SAPCostCenter', costCenterSchema);
