const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
  sectorCode: { type: String, unique: true },
  sectorName: String,
  sectorHeadId: String,
  sectorHeadName: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }  // <-- New
});

module.exports = mongoose.models.Sector || mongoose.model('SAPSector', sectorSchema);
