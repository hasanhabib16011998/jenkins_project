import React from'react';
import CartContextProvider from './components/context/cartContext.js';
import App from './App';

export default function Ecommerce(){
  return (
    <CartContextProvider>
      <App/> 
    </CartContextProvider>
  );
}
