import React, { useEffect, useState } from 'react';

// import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';

import './assets/css/styles.css';
import { Card, FormCheck } from 'react-bootstrap';
import { getTodos } from './core/api';
import { useGetTodos } from './core/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Todo from './Todo';


const App = () => {
  const queryClient = new QueryClient

  return (
    <QueryClientProvider client={queryClient}>
      <Todo />
    </QueryClientProvider>
  )
};

export default App;
