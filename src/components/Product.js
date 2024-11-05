import React, { useContext, useEffect, useState } from 'react'
import {NavLink} from 'react-router-dom'
import axios from 'axios'
import _ from "lodash";
import { CartContext } from './context/cartContext';

export default function Product(){

    const [product,setProduct]=useState([]);
    const [loading,setLoading]=useState(true);
    const [state,dispatch]=useContext(CartContext);
    const [id,setId]=useState(state.p_id);

    const AddItem=()=>{
        dispatch({type:"ADD_ITEM",
        payload:{v_id:_.uniqueId(10),id:product.id,title:product.title,category:product.category,price:product.price,image:product.image,qty:1}
    })
    dispatch({
        type:"GET_TOTAL"
    })
    }

    useEffect(()=>{
        const getProduct=async()=>{
            setLoading(true);
            axios.get(`https://fakestoreapi.com/products/${id}`).then(res=>{
                setProduct(res.data);
                setLoading(false);
                console.log(res.data);
            })
        }

        getProduct();
    },[])

    const ShowProduct = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
        return (
          <>
          <div className='container'>
            <div className='row'>

            <div className="col-md-6">
              <img src={product.image} alt={product.title} height="auto" width="90%" />
            </div>
            <div className="col-md-6">
              <h4 className="text-uppercase text-black-50">{product.category}</h4>
              <p className="lead fw-bolder">
                Rating {product.rating && product.rating.rate}
                <i className="fa fa-star"></i>
              </p>
              <h3 className="display-6 fw-bold my-4">${product.price}</h3>
              <p className="lead">{product.description}</p>
              <button className="btn btn-outline-dark px-4 py-2" onClick={AddItem}>
                Add to Cart
              </button>
              <NavLink to='/cart'
            className="btn btn-dark ms-2 px-3 py-2">
            Go to Cart
          </NavLink>
            </div>
            </div>
            </div>


          </>
        );
      };

      return <ShowProduct/>;
      

}