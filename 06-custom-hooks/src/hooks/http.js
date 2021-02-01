import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      // spreading existing properties
      return { ...currHttpState, loading: true, data: null, extra: null, identifier: action.identifier };
    case 'RESPONSE':
      return { ...currHttpState, loading: false, data: action.responseData, extra: action.extra };
    case 'ERROR':
      return { loading: false, error: action.errorData };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('HTTP BAD!');
  }
};
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), []);

  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
    fetch(url, {
      method: method,
      body: body,
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      dispatchHttp({ type: 'RESPONSE', responsedata: responseData });

    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: 'SOMETHING WRONG!' });
    });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear
  };
};

export default useHttp;