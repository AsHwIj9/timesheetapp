export const decodeToken = (token) => {
    if (!token) return null;
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  };
  
  export const getUserRoleFromToken = (token) => {
    const decoded = decodeToken(token);
    return decoded?.role || null;
  };