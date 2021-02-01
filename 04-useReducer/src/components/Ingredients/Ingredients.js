import React, { useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

// useReducer is used when multiple properties are connected to state
// or when logic can be reused throughout
// or when oldState is relied upon heavily

// just like the usual reducer, but without redux
const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('BAD!');
  }
};

const httpReducer = (currHttpState, action) => {
  switch(action.type) {
    case 'SEND':
      // spreading existing properties
      return { ...currHttpState, loading: true };
    case 'RESPONSE':
      return { ...currHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorData };
    case 'CLEAR ERROR':
      return { ...currHttpState, error: null};
    default:
      throw new Error('HTTP BAD!');
  }
};

const Ingredients = () => {
  // dispatch is the action reducer
  // [] is the initial state
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  // it is to manage side effects like http requests
  // gets executed after and every render cycle like componededDidUpdate
  useEffect(() => {
    fetch('https://database.com/ingredients.json').then(
      response => response.json()
    ).then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        });
      }
      dispatch({type: 'SET', ingredients: loadedIngredients});
    });
  }, []);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS');
  });

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'});
    fetch('https://database.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type':'application/json' }
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'});
      return response.json();
    }).then(responseData => {

      dispatch({type: 'ADD', ingredient: { id: responseData.name, ...ingredient }})

    }).catch(error => {
      dispatchHttp({type: 'ERROR', error: 'HTTP BAD'});
    });
  };

  const removeIngredientHandler = ingId => {
    dispatchHttp({type: 'SEND'});
    fetch(`https://database.com/ingredients/${ingId}`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'});

      dispatch({type: 'DELETE', id: ingId});
    })
  };

  const clearError = () => {
    dispatchHttp({type: 'CLEAR ERROR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
