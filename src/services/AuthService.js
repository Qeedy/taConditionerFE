import api from "../config/AxiosInstance";

const login = async (email, password) => {
  console.log(email)
  const response = await api.post(`/auth/login`, { email, password });
  console.log(response.data)
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};
const register = async (registerUserModel) => {
  const response = await api.post(`/auth/register`, registerUserModel);
  console.log(response.data)
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return !!user && !!user.token;
};

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user.role;
}

const getGender = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user.gender;
}

const handleRegister = async (registerUserModel, onSuccess, onError) => {
  try {
    const test = await register(registerUserModel);
    if (onSuccess) onSuccess(test); 
  } catch (error) {
    if (onError)
      onError(error.response?.data?.message || "Invalid credentials"); 
  }
};

const getProfileData = (() => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData;
})();

const handleLogin = async (email, password, onSuccess, onError) => {
  try {
    const user = await login(email, password);
    if (onSuccess) onSuccess(user);
  } catch (error) {
    if (onError)
      onError(error.response?.data?.message || "Invalid credentials"); 
  }
};

const AuthService = {
  login,
  logout,
  isAuthenticated,
  handleLogin,
  handleRegister,
  getUserRole,
  getGender,
  register,
  getProfileData
};

export default AuthService;
