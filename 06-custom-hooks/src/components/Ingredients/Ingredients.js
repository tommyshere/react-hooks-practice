import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

import useHttp from '../../hooks/http';

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

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  // getting all the objects returned by useHttp
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp();

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
    if (!isLoading && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra })
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra }
      })
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);


  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      `https://firebase.com/ingredients.json`,
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingId => {
    sendRequest(
      `https://firebase.com/ingredients/${ingId}.json`, 
      'DELETE',
      null,
      ingId,
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  // just like useCallback, but instead for objects
  // so whenever userIngredients changes or removeIngredientHandler changes, it will re render
  // alternative to React.memo, useMemo should be used on objects, not components
  const ingredientList = useMemo(() => { 
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>}, 
    [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
