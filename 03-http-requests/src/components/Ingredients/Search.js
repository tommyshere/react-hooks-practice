import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';


// React.memo will make sure it's not re-rendered if props or state did not change
const Search = React.memo(props => {
  // object destructuring
  // set key of props as a separate constant
  // so it can
  const { onLoadIngredients } = props;
  // array destructuring
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      // enteredFilter is the old input so it needs to be compared to the new value
      // inputRef is another hook in line 13
      // set ref in the input component to ensure to get most up to date input value
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch('https://database.com/ingredients.json' + query).then(
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
          onLoadIngredients(loadedIngredients)
        });
      }
      // a built in clean up function for useEffect
      return () => {
        // ensure only one timer at a time (memory efficient)
        clearTimeout(timer);
      };
    }, 500);
    
    // because of object destructuring in line 10
    // whenever the specific key in props change, useEffect will trigger
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text" 
            value={enteredFilter} 
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
