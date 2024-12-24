const fs = require("fs");
const xlsx = require("xlsx");

// Function to read data from an Excel file
const readExcelFile = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return sheetData;
};

const processExcelData = async (filePath, outputFilePath) => {
  try {
    const missingRecord = [];
    const excelData = readExcelFile(filePath);

    // Validation function for required fields
    const validateRequiredFields = (data) => {
      const missingFields = [];
      if (!data?.EmployeeNumber) missingFields.push("employeeNumber");
      if (!data?.FirstName) missingFields.push("firstName");
      if (!data?.LastName) missingFields.push("lastName");
      if (!data?.Gender) missingFields.push("gender");
      if (!data?.Nationality) missingFields.push("nationality");
      if (!data?.MaritalStatus) missingFields.push("maritalStatus");
      if (!data?.Religion) missingFields.push("religion");
      if (!data?.EmailAddress) missingFields.push("email");
      if (!data?.PositionName) missingFields.push("positionName");
      if (!data?.Division) missingFields.push("division");
      if (!data?.DivisionCode) missingFields.push("divisionCode");
      if (!data?.DivisionHeadOfUnit) missingFields.push("divisionHeadOfUnit");
      if (!data?.Department) missingFields.push("department");
      if (!data?.DepartmentCode) missingFields.push("departmentCode");
      if (!data?.CostCentreAccount) missingFields.push("costCenterAccount");
      if (!data?.CostCentreAccountCode)
        missingFields.push("costCenterAccountCode");
      if (!data?.ContractType) missingFields.push("contractType");
      if (!data?.ManagerID) missingFields.push("managerID");
      if (!data?.ManagerEmail) missingFields.push("managerEmail");
      if (!data?.EmployeeStatus) missingFields.push("employeeStatus");
      if (!data?.JobTitle) missingFields.push("jobTitle");
      if (!data?.EmployeeHireDate) missingFields.push("hireDate");
      return missingFields;
    };

    const results = [];
    const changeLogs = [];

    for (const data of excelData) {
      // Validate the data
      const missingFields = validateRequiredFields(data);
      if (missingFields.length > 0) {
        const error_ = {
          message: `Employee ID ${
            data?.EmployeeNumber ?? "NO ID"
          } is missing the following required fields: ${missingFields.join(
            ", "
          )}`,
          data,
        };
        missingRecord.push(error_);
        data.validationStatus = "FAIL";
      } else {
        data.validationStatus = "PASS";
      }

      // Simulate finding data in a database
      const checkInSAP = null; // Replace with actual DB lookup logic

      const newData = {
        firstName: data?.FirstName || '',
        secondName: data?.SecondName || '',
        thirdName: data?.ThirdName || '',
        lastName: data?.LastName || '',
        firstNameAr: data?.ArabicFirstName || '',
        secondNameAr: data?.ArabicSecondName || '',
        thirdNameAr: data?.ArabicThirdName || '',
        lastNameAr: data?.ArabicLastName || '',
        gender: data?.Gender || '',
        nationality: data?.Nationality || '',
        maritalStatus: data?.MaritalStatus || '',
        religion: data?.Religion || '',
        birthCountry: data?.BirthCountry || '',
        email: data?.EmailAddress?.toLowerCase() || '',
        phoneNO: data?.PhoneNumber || '',
        sector: data?.Sector || '',
        sectorCode: data?.SectorCode || '',
        sectorHead: data?.SectorHead || '',
        positionName: data?.PositionName || '',
        division: data?.Division || '',
        divisionCode: data?.DivisionCode || '',
        divisionHeadOfUnit: data?.DivisionHeadOfUnit || '',
        department: data?.Department || '',
        departmentCode: data?.DepartmentCode || '',
        constCenterAccount: data?.CostCentreAccount || '',
        constCenterAccountCode: data?.CostCentreAccountCode || '',
        contractType: data?.ContractType || '',
        managerID: data?.ManagerID || '',
        managerName: data?.ManagerName || '',
        managerEmail: data?.ManagerEmail?.toLowerCase() || '',
        employeeStatus: data?.EmployeeStatus || '',
        employeeNumber: data?.EmployeeNumber || '',
        jobTitle: data?.JobTitle || '',
        hireDate: data?.EmployeeHireDate || '',
        iqamaNumber: data?.IqamaNumber || '',
        iqamaExpiry: data?.IqamaExpiryDate || '',
        passportNo: Array.isArray(data?.PassportNumber) ? data?.PassportNumber[0] || '' : data?.PassportNumber || '',
        passportIssuanceCountry: Array.isArray(data?.PassportIssuanceCountry)
          ? data?.PassportIssuanceCountry[0] || ''
          : data?.PassportIssuanceCountry || '',
        passportExpiry: Array.isArray(data?.PassportExpiryDate)
          ? data?.PassportExpiryDate[0] || ''
          : data?.PassportExpiryDate || '',
        SNI: data?.SNI || '',
        separationDate: data?.SeparationDate || '',
        workVisa: data?.WorkVisa || '',
        passports: Array.isArray(data?.PassportNumber) ? data?.PassportNumber : [],
        passportExpiries: Array.isArray(data?.PassportExpiryDate) ? data?.PassportExpiryDate : [],
        passportCountries: Array.isArray(data?.PassportIssuanceCountry) ? data?.PassportIssuanceCountry : [],
        validationStatus: data?.validationStatus
      };
      results.push(newData);
    }

    // Save results to a JSON file
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(results, null, 2)
    );
    console.log(`Results saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error processing Excel data:", error.message);
  }
};

// Specify the input Excel file and output JSON file
const inputFilePath = "./employee_data.xlsx";
const outputFilePath = "./output.json";

// Process the Excel data
processExcelData(inputFilePath, outputFilePath);
