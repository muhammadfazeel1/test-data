const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    departmentCode: { type: String, unique: true },
    departmentName: String,
    division: { type: mongoose.Schema.Types.ObjectId, ref: 'SAPDivision' },
    sector: { type: mongoose.Schema.Types.ObjectId, ref: 'SAPSector' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'SAPCompany' },
    costCenters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SAPCostCenter' }]
  },
  {
    timestamps: true
  }
);

departmentSchema.methods.toJSON = function () {
  const department = this;
  const departmentObj = department.toObject();
  departmentObj.id = departmentObj._id;
  delete departmentObj._id;
  delete departmentObj.__v;
  return departmentObj;
};

module.exports = mongoose.models.SAPDepartment || mongoose.model('SAPDepartment', departmentSchema);
