const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema(
  {
    sectorCode: { type: String, unique: true },
    sectorName: String,
    sectorHeadId: String,
    sectorHeadName: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'SAPCompany' } // <-- New
  },
  {
    timestamps: true
  }
);

sectorSchema.methods.toJSON = function () {
  const sector = this;
  const sectorObj = sector.toObject();
  sectorObj.id = sectorObj._id;
  delete sectorObj._id;
  delete sectorObj.__v;
  return sectorObj;
};

module.exports = mongoose.models.SAPSector || mongoose.model('SAPSector', sectorSchema);
