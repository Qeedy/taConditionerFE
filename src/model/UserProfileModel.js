class UserProfileModel {
    constructor(uuid='', fullName = '', address = '', email = '', phoneNumber = '', role = '', gender = '', token= '') {
      this.uuid = uuid;
      this.fullName = fullName;
      this.address = address;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.role = role;
      this.gender = gender
      this.token = token;
    }
    
    updateField(fieldName, value) {
      this[fieldName] = value;
    }
  }
  
  export default UserProfileModel;