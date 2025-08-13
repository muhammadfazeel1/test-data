const getDataFetchingLookup = async (req, res, next) => {
  try {
    const identifier = req.query.identifier;
    let requiredKeys = [];
    const query = req.query;
    const today = new Date();
    const condition = { identifier };
    const conditionSAP = {
      employeeStatus: 'Active', // Terminated
      validationStatus: 'PASS'
      // $or: [
      //   { separationDate: { $exists: false } }, // Handles cases where separationDate is not present
      //   { separationDate: { $eq: null } }, // Handles cases where separationDate is null
      //   { separationDate: { $lte: today } } // Handles cases where separationDate is less than or equal to today's date
      // ]
    };

    const limit = query.pageSize ?? 10;
    if (limit < 1) throw error('PAGINATION_PAGE_SIZE_ERROR', 400);
    const page = query.page ?? 1;
    if (page < 1) throw error('PAGINATION_PAGE_ERROR', 400);
    const offset = page * limit - limit;

    if (query.searchText?.length && identifier === 'SECTOR_DEPARTMENT') {
      condition.sectorName = new RegExp(query.searchText, 'i');
    }
    if (query.searchText?.length && identifier === 'DEPARTMENT') {
      condition.departmentName = new RegExp(query.searchText, 'i');
    }

    if (query.searchText?.length && identifier === 'SECTOR') {
      condition.sectorName = new RegExp(query.searchText, 'i');
    }

    if (query.searchText?.length && identifier === 'COST_CENTER') {
      condition.costCenterName = new RegExp(query.searchText, 'i');
    }

    if (query.searchText?.length && identifier === 'REQUESTED_FOR') {
      const searchRegex = new RegExp(query.searchText, 'i');
      conditionSAP.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { iqamaNumber: searchRegex },
        { passportNo: searchRegex },
        { employeeNumber: searchRegex }
      ];
    }

    if (query.searchText?.length && identifier === 'ALL_CITIES') {
      condition.u_name = new RegExp(query.searchText, 'i');
    }

    if (query?.type === 'REQUESTED_FOR') {
      const requiredKeysInfo = [
        'userinfo_department_name',
        'userinfo_employee_name',
        'userinfo_employee_number',
        'userinfo_gender',
        'userinfo_iqama_number',
        'userinfo_nationality',
        'userinfo_passport_number',
        'userinfo_saudi_mobile_number',
        'userinfo_iqama_expirydate',
        'userinfo_religion',
        'userinfo_job_title',
        'userinfo_passport_issuance_country',
        'userinfo_birth_country',
        'userinfo_boarder_number',
        'userdetails_email',
        'userdetails_costcenternum',
        'userdetails_linemanager'
      ];

      const record = await SAPUser.findOne({ _id: identifier });
      if (!record) throw error('BUSINESS_CONTROLLER_PROFILE_ERROR_MESSAGE', 404);

      // Define the exact labels and the corresponding field values from the schema
      const formattedResponse = [
        {
          label: 'Department Name',
          labelAr: 'القسم',
          value: record.department || 'N/A'
        },
        {
          label: 'Employee Name',
          labelAr: 'اسم الموظف',
          value: `${record.firstName || ''} ${record.secondName || ''} ${record.thirdName || ''} ${
            record.lastName || ''
          }`.trim()
        },
        {
          label: 'Employee Number',
          labelAr: 'الرقم الوظيفي',
          value: record.employeeNumber || 'N/A'
        },
        {
          label: 'Gender',
          labelAr: 'الجنس',
          value: record.gender || 'N/A'
        },
        {
          label: 'Iqama No',
          labelAr: 'رقم الإقامة',
          value: record.iqamaNumber || 'N/A'
        },
        {
          label: 'Nationality',
          labelAr: 'الجنسية',
          value: record.nationality || 'N/A'
        },
        {
          label: 'Passport No',
          labelAr: 'رقم جواز السفر',
          value: record.passportNo || 'N/A'
        },
        {
          label: 'Phone No',
          labelAr: 'رقم الهاتف',
          value: record.phoneNO?.length ? `+966-${record.phoneNO}` : 'N/A'
        },
        {
          label: 'Iqama Expiry',
          labelAr: 'تاريخ انتهاء الإقامة',
          value: record?.iqamaExpiry ? formatDateToYYYYMMDD(record?.iqamaExpiry) : 'N/A'
        },
        {
          label: 'Religion',
          labelAr: 'الديانة',
          value: record.religion || 'N/A'
        },
        {
          label: 'Job Title',
          labelAr: 'المسمى الوظيفي',
          value: record.jobTitle || 'N/A'
        },
        {
          label: 'Passport Issuance Country',
          labelAr: 'مكان إصدار جواز السفر',
          value: record.passportIssuanceCountry || 'N/A'
        },
        {
          label: 'Birth Country',
          labelAr: 'مكان الولادة',
          value: record.birthCountry || 'N/A'
        },
        {
          label: 'Boarder No',
          labelAr: 'رقم الحدود',
          value: 'N/A' // If there's no field for this in the schema, default to N/A
        },
        {
          label: 'Email',
          labelAr: 'البريد الإلكتروني',
          value: record.email || 'N/A'
        },
        {
          label: 'Const Center No',
          labelAr: 'Const Center No',
          value: record.constCenterAccountCode || 'N/A'
        },
        {
          label: 'Line Manager',
          labelAr: 'Line Manager',
          value: record.managerName || 'N/A'
        }
      ];

      // Return the formatted response
      res.locals.res_body = {
        statusCode: 200,
        responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
        record: formattedResponse
      };
    } else if (query?.type === 'SECTOR') {
      const checkSector = await sector.findOne({ _id: identifier });
      const checkSectorHead = await SAPUser.findOne({ employeeNumber: checkSector.sectorHeadId });
      const resp = [
        {
          label: 'Sector Head Email',
          labelAr: 'البريد الإلكتروني',
          value: checkSectorHead?.email ?? 'N/A'
        },
        {
          label: 'Sector Head Name',
          labelAr: 'اسم',
          value: checkSectorHead?.firstName + ' ' + checkSectorHead.lastName
        },
        {
          label: 'Sector Name',
          labelAr: 'Sector Name',
          value: checkSector?.sectorName
        },
        {
          label: 'Sector Code',
          labelAr: 'Sector Code',
          value: checkSector?.sectorCode
        }
      ];

      res.locals.res_body = {
        statusCode: 200,
        responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
        record: resp
      };
    } else if (query?.type === 'DEPARTMENT') {
      const checkDepartment = await department.findOne({ _id: identifier });
      const resp = [
        {
          label: 'Name',
          labelAr: 'Name',
          value: checkDepartment?.departmentName ?? 'N/A'
        },
        {
          label: 'Department Code',
          labelAr: 'Department Code',
          value: checkDepartment?.departmentCode ?? 'N/A'
        }
      ];

      res.locals.res_body = {
        statusCode: 200,
        responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
        record: resp
      };
    } else if (query?.type === 'SECTOR_DEPARTMENT') {
      const checkSector = await sector.findOne({ _id: identifier });
      const checkSectorHead = await SAPUser.findOne({ employeeNumber: checkSector.sectorHeadId });
      const resp = [
        {
          label: 'Sector Head Email',
          labelAr: 'البريد الإلكتروني',
          value: checkSectorHead?.email ?? 'N/A'
        },
        {
          label: 'Sector Head Name',
          labelAr: 'اسم',
          value: checkSectorHead?.firstName + ' ' + checkSectorHead.lastName
        },
        {
          label: 'Sector Name',
          labelAr: 'Sector Name',
          value: checkSector?.sectorName
        },
        {
          label: 'Sector Code',
          labelAr: 'Sector Code',
          value: checkSector?.sectorCode
        }
      ];

      res.locals.res_body = {
        statusCode: 200,
        responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
        record: resp
      };
    } else if (query?.type === 'COST_CENTER') {
      const checkCostCenter = await costCenter.findOne({ _id: identifier });
      const resp = [
        {
          label: 'Cost Center Number',
          labelAr: 'رقم مركز التكلفة',
          value: checkCostCenter?.costCenterCode ?? 'N/A'
        },
        {
          label: 'Name',
          labelAr: 'اسم',
          value: checkCostCenter?.costCenterName ?? 'N/A'
        }
      ];

      res.locals.res_body = {
        statusCode: 200,
        responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
        record: resp
      };
    } else if (identifier === 'REQUESTED_FOR') {
      const roles = await Role.find({ _id: { $in: req.auser.roles } });
      const employee = roles.filter((x) => x?.canRequestForOthers === true);
      if (!employee?.length) {
        conditionSAP.email = req.auser.email;
      }

      const [record, count] = await Promise.all([
        SAPUser.find(conditionSAP).skip(offset).limit(limit).sort({ _id: 1 }),
        SAPUser.count(conditionSAP)
      ]);

      const headers = [
        {
          field: 'email',
          headerName: 'Email',
          headerNameAr: 'البريد الإلكتروني'
        },
        {
          field: 'name',
          headerName: 'Name',
          headerNameAr: 'اسم'
        }
      ];

      // Map records to the desired data format
      const data = record.map((record) => {
        return {
          id: record._id.toString(), // Converting MongoDB ObjectId to string
          email: record.email,
          name: `${record.firstName || ''} ${record.secondName || ''} ${record.thirdName || ''} ${
            record.lastName || ''
          }`.trim() // Concatenating name fields
        };
      });

      res.locals.res_body = {
        statusCode: 200,
        responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
        response: { data, headers },
        page,
        offset,
        count
      };
    } else {
      let response = null;
      let count = 0;

      if (query?.identifier === 'SECTOR_DEPARTMENT' || query.identifier === 'SECTOR') {
        const [records, total] = await Promise.all([
          sector.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
          sector.count(condition)
        ]);

        count = total;

        response = {
          headers: [
            {
              field: 'name',
              headerName: 'Name',
              headerNameAr: 'اسم'
            }
          ],
          data: records.map((item) => ({
            id: item.id,
            name: item.sectorName
          }))
        };
      } else if (query?.identifier === 'DEPARTMENT') {
        const [records, total] = await Promise.all([
          department.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
          department.count(condition)
        ]);

        count = total;

        response = {
          headers: [
            {
              field: 'name',
              headerName: 'Name',
              headerNameAr: 'اسم'
            }
          ],
          data: records.map((item) => ({
            id: item.id,
            name: item.departmentName
          }))
        };
      } else if (query?.identifier === 'COST_CENTER') {
        const [records, total] = await Promise.all([
          costCenter.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
          costCenter.count(condition)
        ]);

        count = total;

        response = {
          headers: [
            {
              field: 'name',
              headerName: 'Name',
              headerNameAr: 'اسم'
            },
            {
              field: 'code',
              headerName: 'Cost Center Number',
              headerNameAr: 'رقم مركز التكلفة'
            }
          ],
          data: records.map((item) => ({
            id: item.id,
            name: item.costCenterName,
            code: item.costCenterCode
          }))
        };
      } else {
        const [record, total] = await Promise.all([
          DynamicModel.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
          DynamicModel.count(condition)
        ]);
        if (identifier === 'REQUESTED_FOR') requiredKeys = ['sys_id', 'email', 'name'];
        if (identifier === 'ALL_CITIES') requiredKeys = ['sys_id', 'u_name_ar', 'u_code', 'u_name'];
        count = total;
        response = formatResponse(record, requiredKeys);
      }

      res.locals.res_body = {
        statusCode: 200,
        responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
        response,
        page,
        offset,
        count
      };
    }

    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};


// web

// dashboard


const getDataFetchingLookup = async (req, res, next) => {
    try {
      const identifier = req.query.identifier;
      let requiredKeys = [];
      const query = req.query;
  
      const condition = { identifier };
      const conditionSAP = {};
  
      const limit = query.pageSize ?? 10;
      if (limit < 1) throw error('PAGINATION_PAGE_SIZE_ERROR', 400);
      const page = query.page ?? 1;
      if (page < 1) throw error('PAGINATION_PAGE_ERROR', 400);
      const offset = page * limit - limit;
  
      if (query.searchText?.length && identifier === 'SECTOR_DEPARTMENT') {
        condition.name = new RegExp(query.searchText, 'i');
      }
      if (query.searchText?.length && identifier === 'DEPARTMENT') {
        condition.name = new RegExp(query.searchText, 'i');
      }
  
      if (query.searchText?.length && identifier === 'SECTOR') {
        condition.name = new RegExp(query.searchText, 'i');
      }
  
      if (query.searchText?.length && identifier === 'COST_CENTER') {
        condition.name = new RegExp(query.searchText, 'i');
      }
  
      if (query.searchText?.length && identifier === 'REQUESTED_FOR') {
        const searchRegex = new RegExp(query.searchText, 'i');
        conditionSAP.$or = [{ firstName: searchRegex }, { secondName: searchRegex }, { email: searchRegex }];
      }
  
      if (query.searchText?.length && identifier === 'ALL_CITIES') {
        condition.u_name = new RegExp(query.searchText, 'i');
      }
  
      if (query?.type === 'REQUESTED_FOR') {
        const requiredKeysInfo = [
          'userinfo_department_name',
          'userinfo_employee_name',
          'userinfo_employee_number',
          'userinfo_gender',
          'userinfo_iqama_number',
          'userinfo_nationality',
          'userinfo_passport_number',
          'userinfo_saudi_mobile_number',
          'userinfo_iqama_expirydate',
          'userinfo_religion',
          'userinfo_job_title',
          'userinfo_passport_issuance_country',
          'userinfo_birth_country',
          'userinfo_boarder_number',
          'userdetails_email',
          'userdetails_department',
          'userdetails_costcenternum',
          'userdetails_linemanager'
        ];
  
        let record = await SAPUser.findOne({ _id: identifier });
        if (!record) {
          record = await SAPUser.findOne();
        }
        // Define the exact labels and the corresponding field values from the schema
        const formattedResponse = [
          {
            label: 'Department Name',
            labelAr: 'القسم',
            value: record.department || 'N/A'
          },
          {
            label: 'Employee Name',
            labelAr: 'اسم الموظف',
            value: `${record.firstName || ''} ${record.secondName || ''} ${record.thirdName || ''} ${
              record.lastName || ''
            }`.trim()
          },
          {
            label: 'Employee Number',
            labelAr: 'الرقم الوظيفي',
            value: record.employeeNumber || 'N/A'
          },
          {
            label: 'Gender',
            labelAr: 'الجنس',
            value: record.gender || 'N/A'
          },
          {
            label: 'Iqama No',
            labelAr: 'رقم الإقامة',
            value: record.iqamaNumber || 'N/A'
          },
          {
            label: 'Nationality',
            labelAr: 'الجنسية',
            value: record.nationality || 'N/A'
          },
          {
            label: 'Passport No',
            labelAr: 'رقم جواز السفر',
            value: record.passportNo || 'N/A'
          },
          {
            label: 'Phone No',
            labelAr: 'رقم الهاتف',
            value: record.phoneNO?.length ? `+966-${record.phoneNO}` : 'N/A'
          },
          {
            label: 'Iqama Expiry',
            labelAr: 'تاريخ انتهاء الإقامة',
            value: record.iqamaExpiry || 'N/A'
          },
          {
            label: 'Religion',
            labelAr: 'الديانة',
            value: record.religion || 'N/A'
          },
          {
            label: 'Job Title',
            labelAr: 'المسمى الوظيفي',
            value: record.jobTitle || 'N/A'
          },
          {
            label: 'Passport Issuance Country',
            labelAr: 'مكان إصدار جواز السفر',
            value: record.passportIssuanceCountry || 'N/A'
          },
          {
            label: 'Birth Country',
            labelAr: 'مكان الولادة',
            value: record.birthCountry || 'N/A'
          },
          {
            label: 'Boarder No',
            labelAr: 'رقم الحدود',
            value: 'N/A' // If there's no field for this in the schema, default to N/A
          },
          {
            label: 'Email',
            labelAr: 'البريد الإلكتروني',
            value: record.email || 'N/A'
          },
          {
            label: 'Const Center No',
            labelAr: 'Const Center No',
            value: record.constCenterAccountCode || 'N/A'
          },
          {
            label: 'Line Manager',
            labelAr: 'Line Manager',
            value: record.managerName || 'N/A'
          }
        ];
  
        // Return the formatted response
        res.locals.res_body = {
          statusCode: 200,
          responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
          record: formattedResponse
        };
      } else if (query?.type === 'SECTOR') {
        const checkSector = await sector.findOne({ _id: identifier });
        const checkSectorHead = await SAPUser.findOne({ employeeNumber: checkSector.sectorHeadId });
        const resp = [
          {
            label: 'Sector Head Email',
            labelAr: 'البريد الإلكتروني',
            value: checkSectorHead?.email ?? 'N/A'
          },
          {
            label: 'Sector Head Name',
            labelAr: 'اسم',
            value: checkSectorHead?.firstName + ' ' + checkSectorHead.lastName
          },
          {
            label: 'Sector Name',
            labelAr: 'Sector Name',
            value: checkSector?.sectorName
          },
          {
            label: 'Sector Code',
            labelAr: 'Sector Code',
            value: checkSector?.sectorCode
          }
        ];
  
        res.locals.res_body = {
          statusCode: 200,
          responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
          record: resp
        };
      } else if (query?.type === 'DEPARTMENT') {
        const checkDepartment = await department.findOne({ _id: identifier });
        const resp = [
          {
            label: 'Name',
            labelAr: 'Name',
            value: checkDepartment?.departmentName ?? 'N/A'
          },
          {
            label: 'Department Code',
            labelAr: 'Department Code',
            value: checkDepartment?.departmentCode ?? 'N/A'
          }
        ];
  
        res.locals.res_body = {
          statusCode: 200,
          responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
          record: resp
        };
      } else if (query?.type === 'SECTOR_DEPARTMENT') {
        const checkSector = await sector.findOne({ _id: identifier });
        const checkSectorHead = await SAPUser.findOne({ employeeNumber: checkSector.sectorHeadId });
        const resp = [
          {
            label: 'Sector Head Email',
            labelAr: 'البريد الإلكتروني',
            value: checkSectorHead?.email ?? 'N/A'
          },
          {
            label: 'Sector Head Name',
            labelAr: 'اسم',
            value: checkSectorHead?.firstName + ' ' + checkSectorHead.lastName
          },
          {
            label: 'Sector Name',
            labelAr: 'Sector Name',
            value: checkSector?.sectorName
          },
          {
            label: 'Sector Code',
            labelAr: 'Sector Code',
            value: checkSector?.sectorCode
          }
        ];
  
        res.locals.res_body = {
          statusCode: 200,
          responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
          record: resp
        };
      } else if (query?.type === 'COST_CENTER') {
        const checkCostCenter = await costCenter.findOne({ _id: identifier });
        const resp = [
          {
            label: 'Cost Center Number',
            labelAr: 'رقم مركز التكلفة',
            value: checkCostCenter?.costCenterCode ?? 'N/A'
          },
          {
            label: 'Name',
            labelAr: 'اسم',
            value: checkCostCenter?.costCenterName ?? 'N/A'
          }
        ];
  
        res.locals.res_body = {
          statusCode: 200,
          responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
          record: resp
        };
      } else if (identifier === 'REQUESTED_FOR') {
        let [record, count] = await Promise.all([
          SAPUser.find(conditionSAP).skip(offset).limit(limit).sort({ _id: 1 }),
          SAPUser.count(conditionSAP)
        ]);
  
        if (!record?.length) {
          [record, count] = await Promise.all([
            SAPUser.find(conditionSAP).skip(offset).limit(limit).sort({ _id: 1 }),
            SAPUser.count(conditionSAP)
          ]);
        }
  
        const headers = [
          {
            field: 'email',
            headerName: 'Email',
            headerNameAr: 'البريد الإلكتروني'
          },
          {
            field: 'name',
            headerName: 'Name',
            headerNameAr: 'اسم'
          }
        ];
  
        // Map records to the desired data format
        const data = record.map((record) => {
          return {
            id: record._id.toString(), // Converting MongoDB ObjectId to string
            email: record.email,
            name: `${record.firstName || ''} ${record.secondName || ''} ${record.thirdName || ''} ${
              record.lastName || ''
            }`.trim() // Concatenating name fields
          };
        });
  
        res.locals.res_body = {
          statusCode: 200,
          responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
          response: { data, headers },
          page,
          offset,
          count
        };
      } else {
        let response = null;
        let count = 0;
  
        if (query?.identifier === 'SECTOR_DEPARTMENT' || query.identifier === 'SECTOR') {
          const [records, total] = await Promise.all([
            sector.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
            sector.count(condition)
          ]);
  
          count = total;
  
          response = {
            headers: [
              {
                field: 'name',
                headerName: 'Name',
                headerNameAr: 'اسم'
              }
            ],
            data: records.map((item) => ({
              id: item.id,
              name: item.sectorName
            }))
          };
        } else if (query?.identifier === 'DEPARTMENT') {
          const [records, total] = await Promise.all([
            department.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
            department.count(condition)
          ]);
  
          count = total;
  
          response = {
            headers: [
              {
                field: 'name',
                headerName: 'Name',
                headerNameAr: 'اسم'
              }
            ],
            data: records.map((item) => ({
              id: item.id,
              name: item.departmentName
            }))
          };
        } else if (query?.identifier === 'COST_CENTER') {
          const [records, total] = await Promise.all([
            costCenter.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
            costCenter.count(condition)
          ]);
  
          count = total;
  
          response = {
            headers: [
              {
                field: 'name',
                headerName: 'Name',
                headerNameAr: 'اسم'
              },
              {
                field: 'code',
                headerName: 'Cost Center Number',
                headerNameAr: 'رقم مركز التكلفة'
              }
            ],
            data: records.map((item) => ({
              id: item.id,
              name: item.costCenterName,
              code: item.costCenterCode
            }))
          };
        } else {
          const [record, total] = await Promise.all([
            DynamicModel.find(condition).skip(offset).limit(limit).sort({ _id: 1 }),
            DynamicModel.count(condition)
          ]);
          if (identifier === 'REQUESTED_FOR') requiredKeys = ['sys_id', 'email', 'name'];
          if (identifier === 'ALL_CITIES') requiredKeys = ['sys_id', 'u_name_ar', 'u_code', 'u_name'];
          count = total;
          response = formatResponse(record, requiredKeys);
        }
  
        res.locals.res_body = {
          statusCode: 200,
          responseMessage: ['MOBILE_WEB_GLOBAL_SEARCH_SUCCESS_MESSAGE'],
          response,
          page,
          offset,
          count
        };
      }
  
      return next();
    } catch (error) {
      return next(error);
    }
  };
  