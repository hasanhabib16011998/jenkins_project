import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { CartContext } from './context/cartContext'
import './Products.css'

export default function Products() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]); // new state for color filter
  const [loading, setLoading] = useState(false);
  const [state,dispatch]=useContext(CartContext)

  const filterProduct = (e) => {
    const updatedList = data.filter((x) => x.category === e);
    setFilter(updatedList);
    setColorFilter([]); // clear the color filter when a category filter is applied
  }

  const filterColor = (color) => {
    if (color === 'Black') {
      const updatedList = data.filter((x) => x.id === 9 || x.id === 10 || x.id === 11 || x.id === 12 || x.id === 13);
      setColorFilter(updatedList);
    } else if (color === 'Blue') {
      const updatedList = data.filter((x) => x.id === 1 || x.id === 4 || x.id === 15 || x.id === 17);
      setColorFilter(updatedList);
    } else if (color === 'Red') {
      const updatedList = data.filter((x) => x.id === 19);
      setColorFilter(updatedList);
    } else {
      setColorFilter([]);
    }
  }

  const filterPrice = (e) => {
    if (e.target.id ==='low') {
      const updatedList = data.filter((x) => x.price > 1 && x.price < 75);
      setFilter(updatedList);
      setColorFilter([]); // clear the color filter when a price filter is applied
    } else if (e.target.id === 'medium') {
      const updatedList = data.filter((x) => x.price > 76 && x.price < 150);
      setFilter(updatedList);
      setColorFilter([]); // clear the color filter when a price filter is applied
    } else if (e.target.id === 'high') {
      const updatedList = data.filter((x) => x.price > 151 && x.price < 1000);
      setFilter(updatedList);
      setColorFilter([]); // clear the color filter when a price filter is applied
    } else {
      setFilter(data);
      setColorFilter([]); // clear the color filter when the "All" filter is applied
    }
  }

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const res = await axios.get('https://fakestoreapi.com/products');
      console.log(res);
      setData(res.data);
      setFilter(res.data);
      setLoading(false);
    };
    getProducts();
  }, []);

  const ShowProducts = () => {
    let products = filter;
  
    if (colorFilter.length > 0) {
      products = colorFilter;
    }
  
    return (
      <>
        {products.map((product) => { // change filter to products
          return (
            <div className='col-md-4 mb-3' key={product.id}>
              <div className='card p-4 text-center'>
                <div className='hover01 column'>
                  <NavLink to='/modal'>
                    <figure>
                      <img src={product.image} className='card-img-top' alt={product.title} onClick={()=>{
                      dispatch({type:'P_ID',payload:product.id})
                      dispatch({type:'MODAL'})
                    
                    }}/>
                    </figure>
                  </NavLink>
  
                  <div className='card-body'>
                    <h5 className='card-title mb-0'>{product.title}</h5>
                    <p className='card-text lead fw-bold'>Price: ${product.price}</p>
  
                    <NavLink to={'./product'}>
                      <button className='btn btn-outline-dark buy-btn' onClick={()=>{dispatch({type:"P_ID",payload:product.id})}}>Buy Now</button>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <div className="container my-5 py-5">
        <div className="row">
          <div className="col-12 mb-5">
            <h1 className="display-6 hw-bolder text-center">Latest Products</h1>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-2'>
        <section id='sidebar'>
            <div>
                <h6 className='p-1 border-bottom'>
                    Category
                </h6>

                <ul>
                    <li><button className='btn btn-outline-dark' onClick={()=>setFilter(data)}>All</button></li>
                    <li><button className='btn btn-outline-dark' onClick={()=>{filterProduct("men's clothing")}}>Men</button></li>
                    <li><button className='btn btn-outline-dark' onClick={()=>{filterProduct("women's clothing")}}>Women</button></li>
                    <li><button className='btn btn-outline-dark' onClick={()=>{filterProduct("jewelery")}}>Jewelery</button></li>
                    <li><button className='btn btn-outline-dark' onClick={()=>{filterProduct("electronics")}}>Electronics</button></li>
                </ul>

            </div>
            <div>
            <h6 className='p-1 border-bottom'>
                    Filter by
                </h6>

                <p className='mb-2'>color</p>
                <ul className='list-group'>
                    <li className='list-group-item list-group-item-action mb-2 rounded'>
                        <span className='fa fa-circle pr-1' id='red' onClick={()=>filterColor("Red")}></span> Red
                    </li>
                    <li className='list-group-item list-group-item-action mb-2 rounded'>
                        <span className='fa fa-circle pr-1' id='black' onClick={()=>filterColor("Black")}></span> Black
                    </li>
                    <li className='list-group-item list-group-item-action mb-2 rounded'>
                        <span className='fa fa-circle pr-1' id='blue' onClick={()=>filterColor("Blue")}></span> Blue
                    </li>
                </ul>
            </div>

            <div>
                <h6>Price</h6>
                <form className='ml-md-2' onChange={(e)=>filterPrice(e)}></form>
                <div className='form-inline border-rounded p-sm-2 my-2'>
                    <input type='radio' name='type'/>
                    <label className='pl-1 pt-sm-0 pt-1' id='low'>$1---$75</label>
                </div>
                <div className='form-inline border-rounded p-sm-2 my-2'>
                    <input type='radio' name='type'/>
                    <label className='pl-1 pt-sm-0 pt-1' id='medium'>$76---$150</label>
                </div>
                <div className='form-inline border-rounded p-sm-2 my-2'>
                    <input type='radio' name='type'/>
                    <label className='pl-1 pt-sm-0 pt-1' id='high'>$151---$1000</label>
                </div>
            </div>

        </section>

      </div>  

        <div className="col-10">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              <ShowProducts/>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
