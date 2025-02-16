class RegisterUserModel {
    constructor(fullName = '', address = '', email = '', phoneNumber = '', password = '', role = '', gender = '') {
      this.fullName = fullName;
      this.address = address;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.password = password;
      this.role = role;
      this.gender = gender;
    }
    
    updateField(fieldName, value) {
      this[fieldName] = value;
    }
  }
  
  export default RegisterUserModel;