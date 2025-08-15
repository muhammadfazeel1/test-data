const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

// for future incase of arabic handling please use Ar for keys like teamNameAr

const userSchema = new mongoose.Schema(
  {
    employeeNumber: {
      type: String,
      required: false
    },
    firstName: {
      type: String,
      required: false
    },
    secondName: {
      type: String,
      required: false
    },
    thirdName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: false
    },
    firstNameAr: {
      type: String,
      required: false
    },
    secondNameAr: {
      type: String,
      required: false
    },
    thirdNameAr: {
      type: String,
      required: false
    },
    lastNameAr: {
      type: String,
      required: false
    },
    gender: {
      type: String,
      required: false
    },
    nationality: {
      type: String,
      required: false
    },
    maritalStatus: {
      type: String,
      required: false
    },
    religion: {
      type: String,
      required: false
    },
    birthCountry: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    phoneNO: {
      type: String,
      required: false
    },
    sector: {
      type: String
    },
    sectorCode: {
      type: String
    },
    sectorHead: {
      type: String
    },
    positionName: {
      type: String,
      required: false
    },
    division: {
      type: String,
      required: false
    },
    divisionCode: {
      type: String,
      required: false
    },
    divisionHeadOfUnit: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false
    },
    departmentCode: {
      type: String,
      required: false
    },
    constCenterAccount: {
      type: String,
      required: false
    },
    constCenterAccountCode: {
      type: String,
      required: false
    },
    contractType: {
      type: String,
      required: false
    },
    managerID: {
      type: String,
      required: false
    },
    managerName: {
      type: String
    },
    managerEmail: {
      type: String,
      required: false
    },
    employeeStatus: {
      type: String,
      required: false,
      default: 'Active'
    },
    jobTitle: {
      type: String,
      required: false
    },
    hireDate: {
      type: String,
      required: false
    },
    separationDate: {
      type: Date,
      required: false
    },
    iqamaNumber: {
      type: String
    },
    iqamaExpiry: {
      type: String
    },
    passportNo: {
      type: String
    },
    passportIssuanceCountry: {
      type: String
    },
    passportExpiry: {
      type: String
    },
    workVisa: {
      type: String
    },
    SNI: {
      type: String
    },
    passports: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    passportExpiries: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    passportCountries: {
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
    validationStatus: {
      type: String,
      default: 'PASS'
    },
    companyCode: {
      type: String
    },
    companyName: {
      type: String
    },
    sectorHeadName: {
      type: String
    },
    sectorHeadEmail: {
      type: String
    },
    contractEndDate: {
      type: String
    },
    contractPeriod: {
      type: String
    },
    probationPeriod: {
      type: String
    },
    standardWeeklyHours: {
      type: String
    },
    locationGroup: {
      type: String
    },
    workLocation: {
      type: String
    },
    lastWorkingDay: {
      type: String
    },
    leavingReason: {
      type: String
    },
    presentAddress: {
      type: String
    },
    muqeemPassportExpiry: {
      type: String, // or Date
      required: false
    },
    muqeemIqamaIssueDate: {
      type: String, // or Date
      required: false
    },
    muqeemName: { type: String },
    muqeemExitReEntryOutSideOfKingdom: { type: String }, // keep exact key you asked for
    muqeemExitReEntryStatus: { type: String },
    muqeemExitReEntryVisaDuration: { type: String },
    muqeemExitReEntryVisaNumber: { type: String },
    muqeemExitReEntryVisaType: { type: String },
    muqeemExitReEntryVisaIssuanceDate: { type: String },
    muqeemExitReEntryVisaExpiryDate: { type: String },
    muqeemNationality: { type: String },
    muqeemJobTitle: { type: String },
    muqeemExitReEntryVisaIssuePlace: { type: String }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  userObject.id = userObject._id;
  delete userObject._id;
  delete userObject.__v;
  return userObject;
};

userSchema.plugin(mongoose_delete, {
  deletedAt: true,
  deletedBy: true,
  overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate', 'update']
});

const SAPUser = mongoose.model('updatedRecordsNotMuq_New', userSchema);

module.exports = SAPUser;
