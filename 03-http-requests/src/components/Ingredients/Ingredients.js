import React, { useState, useEffect, useCallback } from 'react';
import IngredientForm from './IngredientForm';

import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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

      setUserIngredients(loadedIngredients);
    });
  // the second parameter tells when to use useEffect when that second parameter has changed
  // [] ensures that it renders once
  // so having [] is like componentDidMount
  }, []);

  // can use multiple useEffect
  useEffect(() => {
    console.log('RENDERING INGREDIENTS');
  });

  // we don't need to re-render the component that uses this callback function
  // so if nothing has changed, it will not re-render
  // Search is reliant on filteredIngredients, so if filteredIngredients does not change
  // no need to render Search again
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://database.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type':'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        // .name is a firebase thing
        { id: responseData.name, ...ingredient }
      ]);
    }).catch(error => {
      setError('Something wrong!');
    });
  };

  const removeIngredientHandler = ingId => {
    setIsLoading(true);
    fetch(`https://database.com/ingredients/${ingId}`, {
      method: 'DELETE',
    }).then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingId));
    })
  };

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
