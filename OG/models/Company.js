const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyCode: { type: String, unique: true },
  companyName: String
});

module.exports = mongoose.models.Company || mongoose.model('SAPCompany', companySchema);
