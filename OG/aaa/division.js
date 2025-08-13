const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema(
  {
    divisionCode: { type: String, unique: true },
    divisionName: String,
    divisionHeadId: String,
    divisionHeadName: String,
    sector: { type: mongoose.Schema.Types.ObjectId, ref: 'SAPSector' }
  },
  {
    timestamps: true
  }
);

divisionSchema.methods.toJSON = function () {
  const division = this;
  const divisionObj = division.toObject();
  divisionObj.id = divisionObj._id;
  delete divisionObj._id;
  delete divisionObj.__v;
  return divisionObj;
};

module.exports = mongoose.models.SAPDivision || mongoose.model('SAPDivision', divisionSchema);
