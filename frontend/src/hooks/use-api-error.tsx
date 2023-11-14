import { createContext, useContext, useState } from 'react';
import { ApiErrorContextProps, ErrorContext } from './hooks.types';

const ApiErrorContext = createContext<null | ErrorContext>(null);

export const ApiErrorProvider = ({ children } : ApiErrorContextProps) => {
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const addError = (message : string) => setError(message);
  const removeError = () => setError('');

  const contextValue = {
    error,
    open,
    setOpen,
    addError,
    removeError,
  };

  return (
    <ApiErrorContext.Provider value={contextValue}>
      {children}
    </ApiErrorContext.Provider>
  )
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApiError = () => {
  const context = useContext(ApiErrorContext);
  if (context === undefined) {
    throw new Error('ApiErrorContext must be used within a ApiErrorProvider');
  }
  const { error, open, setOpen, addError, removeError } = context as ErrorContext;

  return { error, open, setOpen, addError, removeError};
};
