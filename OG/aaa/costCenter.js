const mongoose = require('mongoose');

const costCenterSchema = new mongoose.Schema(
  {
    costCenterCode: { type: String }, // not unique due to shared use
    costCenterName: String,
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SAPDepartment' }],
    sectors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SAPSector' }]
  },
  {
    timestamps: true
  }
);

costCenterSchema.methods.toJSON = function () {
  const constCenter = this;
  const costCenterObj = constCenter.toObject();
  costCenterObj.id = costCenterObj._id;
  delete costCenterObj._id;
  delete costCenterObj.__v;
  return costCenterObj;
};

module.exports = mongoose.models.SAPCostCenter || mongoose.model('SAPCostCenter', costCenterSchema);
