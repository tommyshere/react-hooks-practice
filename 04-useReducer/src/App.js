import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  // normally it would be "return <AuthContext.Consumer></AuthContext.Consumer>"
  // to use the Context
  // but now there's useContext in React Hooks to access the context now!
  const authContext = useContext(AuthContext);

  let content = <Auth />
  if (authContext.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;
