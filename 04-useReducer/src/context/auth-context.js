import React, { useState } from 'react';

// createContext from React Context API
// ensures we can use props required by multiple components 
// without passing a prop through every level
export const AuthContext = React.createContext({ 
  isAuth: false,
  login: () => {}
});

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{login: loginHandler, isAuth: isAuthenticated}}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;