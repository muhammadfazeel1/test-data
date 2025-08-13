const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  divisionCode: { type: String, unique: true },
  divisionName: String,
  divisionHeadId: String,
  divisionHeadName: String,
  sector: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector' }
});

module.exports = mongoose.models.Division || mongoose.model('SAPDivision', divisionSchema);
