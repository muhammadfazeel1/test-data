const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentCode: { type: String, unique: true },
  departmentName: String,
  division: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
  sector: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  costCenters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CostCenter' }]
});

module.exports = mongoose.models.Department || mongoose.model('SAPDepartment', departmentSchema);
