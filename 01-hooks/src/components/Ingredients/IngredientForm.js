import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  // useState can be any type of variable, 
  // but class based components HAD to be an object
  const inputState = useState({
    title: '',
    amount: ''
  });
  // useState hook will always return an array with 2 elements:
  // 1st: the current state snapshot or the updated state snapshot
  // 2nd: a FUNCTION that allows you to update the curren state

  const submitHandler = event => {
    event.preventDefault();
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input 
              type="text" 
              id="title" 
              value={inputState[0].title} 
              onChange={event => {
                // these events don't create a new object for events, but reuses the object from before
                // special case because of the way React handles event objects
                // thus a workaround to create a new value
                const newTitle = event.target.value;
                inputState[1](prevInputState => ({
                  title: newTitle, 
                  // this way it ensures it always uses the most up to date state
                  // even if the user hasn't finished updating the state
                  amount: prevInputState.amount
                }))}
              }/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={inputState[0].amount} 
              onChange={event => {
                const newAmount = event.target.value;
                inputState[1](prevInputState => ({
                  amount: newAmount, 
                  title: prevInputState.title
                }))}
              }/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
