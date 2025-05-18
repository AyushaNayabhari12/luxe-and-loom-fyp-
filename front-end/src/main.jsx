import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import './index.css';
import {OrderContextProvider} from "./context/OrderContext.jsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthContextProvider>
         <OrderContextProvider>
             <App />
         </OrderContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
);

