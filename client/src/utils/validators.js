// utils/validators.js
export const validateExpense = (expenseData) => {
  const errors = {};
  console.log(expenseData);

  if (!expenseData.amount) errors.amount = "Amount is required";
  if (!expenseData.category) errors.category = "Category is required";
  if (!expenseData.payMethode) errors.payMethode = "Payment Method is required";
  if (!expenseData.depServ) errors.depServ = "Department/Service is required";
  if (!expenseData.status) errors.status = "Status is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Similar for income and saving...
export const validateIncome = (incomeData) => {
  const errors = {};
  console.log(incomeData);

  if (!incomeData.amount) errors.amount = "Amount is required";
  if (!incomeData.category) errors.category = "Category is required";
  if (!incomeData.payMethode) errors.payMethode = "Payment Methode is required";
  // if (!incomeData.employeeInvolved)
  //   errors.employeeInvolved = "EmployeeInvolved is required";
  if (!incomeData.status) errors.status = "Status is required";
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


// Similar for income and saving...
export const validateSaving = (savingData) => {
  const errors = {};
  console.log(savingData);

  if (!savingData.amount) errors.amount = "Amount is required";
  if (!savingData.category) errors.category = "Category is required";

  if (!savingData.depoMethode)
    errors.depoMethode = "Deposit Methode is required";
  if (!savingData.status) errors.status = "Status is required";

  // console.log(errorss);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};






// validat customer...
export const validateCustomer = (customerData) => {
  const errors = {};
  console.log(customerData);

  if (!customerData.fullName) errors.fullName = "FullName is required";
  if (customerData.phone.length < 10) errors.phone = "Phone is required";

  // console.log(errorss);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
// validat customer...
export const validateAppointment = (appointmentData) => {
  const errors = {};
  console.log(appointmentData);

  // !work on form validation

  // Validate the service name
  if (appointmentData.type === "Service") {
    // if(){}
    if (appointmentData.interval.start.date === "Invalid Date" || appointmentData.interval.start.date === undefined) {
      errors.startDate = "Date is required";
    }
    if (!appointmentData.interval.start.time) {
      errors.startTime = "Time is required";
    }
    if (!appointmentData.interval.end.time) {
      errors.endTime = "Time is required";
    }
    if (!appointmentData.concerned?.id) {
      errors.concerned = "Concerned is required";
    }
    if (!appointmentData.reason) {
      errors.reason = "Reason is required";
    }
    if (!appointmentData.nurse) {
      errors.nurse = "Nurse is required";
    }
    if (!appointmentData.room) {
      errors.room = "Room is required";
    }
  } else if (appointmentData.type === "Time Off") {
   
    
    
    if (appointmentData.interval.start.date === "Invalid Date" || appointmentData.interval.start.date === undefined) {
      errors.startDate = "Date is required";
    }
    if (appointmentData.interval.end.date === "Invalid Date" || appointmentData.interval.end.date === undefined) {
      errors.endDate = "Date is required";
    }
    if (!appointmentData.concerned) {
      errors.concerned = "Concerned is required";
    }
    if (!appointmentData.reason) {
      errors.reason = "Reason is required";
    }

    
  } else if (appointmentData.type === "Reminder") {
    if (
      appointmentData.interval.start.date === "Invalid Date" || appointmentData.interval.start.date === undefined
    ) {
      errors.startDate = "Date is required";
    }
    if (!appointmentData.interval.start.time) {
      errors.startTime = "Time is required";
    }
    if ( !appointmentData.desc) {
      errors.desc = "Description is required";
    }
    
  } else {
    errors.type = "Type is not valid";
  }

  // console.log(errorss);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSubService = (subServiceData) => {
  const errors = {};
  console.log(subServiceData);

  if (!subServiceData.title) errors.title = "Sub-Service title is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePackage = (packageData) => {
  const errors = {};
  console.log(packageData);

  if (!packageData.name) errors.name = "Package name is required";
  if (!packageData.price) errors.price = "Price is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateService = (serviceData) => {
  const errors = {};
  console.log(serviceData);

  if (!serviceData.title) errors.title = "Service title is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};



// validat Employee...
export const validateEmployee = (employeeData) => {
  const errors = {};
  console.log(employeeData);

  if (!employeeData.details.firstName) errors.firstName = "first Name is required";
  if (!employeeData.details.email) errors.email = "Email is required";
  if (!employeeData.details.status) errors.status = "Status is required";
  if (!employeeData.details.role || !employeeData.details.role) errors.role = "Role is required";
  if (!employeeData.details.department) errors.department = "Department is required";
  if (employeeData.details.role !== 111 && employeeData.details.status === 111) errors.status = "Status is required";

  // console.log(errorss);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


export const validateNeeds = (needData) => {
  const errors = {};
  console.log(needData);

  if (!needData.name) errors.name = "Product Name is required";
  if (!needData.quantity) errors.quantity = "Quantity is required";
  if (!needData.unit) errors.unit = "Unit is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateNote = (noteData) => {
  const errors = {};
  console.log(noteData);

  if (!noteData.writer) errors.writer = "Writer is required";
  if (!noteData.category) errors.category = "Category is required";
  if (!noteData.content) errors.content = "Content is required";


  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegister = (registerData) => {
  const errors = {};
  console.log(registerData);

  // Name validations
  if (!registerData.firstName?.trim()) {
    errors.firstName = "First Name is required";
  } else if (registerData.firstName.length < 2) {
    errors.firstName = "First Name must be at least 2 characters";
  }


  if (!registerData.lastName?.trim()) {
    errors.lastName = "Last Name is required";
  } else if (registerData.lastName.length < 2) {
    errors.lastName = "Last Name must be at least 2 characters";
  }


  // Email validation
  if (!registerData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
    errors.email = "Please enter a valid email address";
  }


  // Password validation
  if (!registerData.password) {
    errors.password = "Password is required";
  } else if (registerData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(registerData.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(registerData.password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(registerData.password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/[!@#$%^&*]/.test(registerData.password)) {
    errors.password = "Password must contain at least one special character";
  }
  
  // Confirm password validation
  if (!registerData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (registerData.password !== registerData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }


  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
