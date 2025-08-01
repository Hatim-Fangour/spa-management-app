// utils/roleRedirects.js
export const getRoleRedirect = (role) => {
  const redirects = {
    
    //! ADMIN
    705: '/dashboard',      
    //! MANAGER
    493: '/dashboard',       
    //! NURSE
    159: '/customers',      
    111: '/newuser', 
    
  };
  
  return redirects[role] || '/unauthorized'; // Default fallback
};

// utils/roleRedirects.js
export const getRoleAccess = (role) => {
  const access = {
    //! ADMIN
    705: ['/dashboard', '/calendar', '/customers', '/needs', '/employees' ],  // full access
    //! MANAGER    
    531: ['/dashboard', '/calendar', '/customers', '/needs' ],  
    //! NURSE     
    324: ['/calendar', '/customers', '/needs' ],   // CANNOT edit amployees timeOff   

  };
  
  return access[role] || '/'; // Default fallback
};