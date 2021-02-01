import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal';

import useHttp from '../../hooks/http';


// React.memo will make sure it's not re-rendered if props or state did not change
const Search = React.memo(props => {
  // object destructuring
  // set key of props as a separate constant
  // so it can
  const { onLoadIngredients } = props;
  // array destructuring
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      // enteredFilter is the old input so it needs to be compared to the new value
      // inputRef is another hook in line 13
      // set ref in the input component to ensure to get most up to date input value
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          'https://database.com/ingredients.json' + query,
          'GET'
        )
      };

      return () => {
        clearTimeout(timer);
      };
    }, 500);
  }, [enteredFilter, onLoadIngredients, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {/* '&&' the new way to check if a value is true/false */}
      { error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          { isLoading && <span>Loading...</span> }
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
