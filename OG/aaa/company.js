const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyCode: { type: String, unique: true },
    companyName: String
  },
  {
    timestamps: true
  }
);

companySchema.methods.toJSON = function () {
  const company = this;
  const companyObj = company.toObject();
  companyObj.id = companyObj._id;
  delete companyObj._id;
  delete companyObj.__v;
  return companyObj;
};

module.exports = mongoose.models.Company || mongoose.model('SAPCompany', companySchema);
