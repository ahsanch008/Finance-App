const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';

// Token management
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// User management
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};
export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(USER_KEY);

// Login
export const login = (token, user) => {
  setToken(token);
  setUser(user);
};

// Logout
export const logout = () => {
  removeToken();
  removeUser();
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = getToken();
  return !!token;
};

// Get auth header
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};