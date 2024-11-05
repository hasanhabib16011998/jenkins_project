import React from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import NavbarEcom from './components/Navbar'
import Home from './components/Home'
import Products from './components/Products'
import Product from './components/Product'
import Cart from './components/Cart'
import Modal from './components/Modal'

export default function App(){
  return(
    <>
    <Router>
    <NavbarEcom/>
    <Routes>


      <Route path='/' element={<Home/>}/>
      <Route path='/Products' element={<Products/>}/>
      <Route path='/product' element={<Product/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/modal' element={<Modal/>}/>
    </Routes>
    </Router>

    </>
  )
}