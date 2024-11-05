import React, { useContext, useState } from 'react';
import { CartContext } from './context/cartContext';
import Product from './Product';
import './Cart.css';

function CartDesign({ product, delItem }) {
  const [quantity, setQuantity] = useState(1);
  const [state, dispatch] = useContext(CartContext);

  const incre = () => {
    setQuantity((prev) => prev + 1);
    q_change2(quantity+1);
  };

  const dcre = () => {
    if (quantity != 0) {
      setQuantity((prev) => prev - 1);
      q_change2(quantity-1);
    } else {
      return;
    }
  };

  const q_Change = (e) => {
    if (e.target.value >= 1) {
      {setQuantity(e.target.value);}
      dispatch({ type: 'ADD_QTY', payload: { id: product.id, qty: e.target.value } });
      dispatch({ type: 'GET_TOTAL' });
    }
  };

  const q_change2=(e)=>{
    dispatch({type:'ADD_QTY',payload:{id:product.id,qty:e}});
    dispatch({type:'GET_TOTAL'});
  }

  return (
    <>
      <div className='d-flex justify-content-between align-items-center mt-3 p-2 items rounded' key={product.id}>
        <div className='d-flex flex-row'>
          <img className='rounded' src={product.image} width='40px' />
          <div className='ml-4'>
            <span className='font-weight-bold'>{`${product.title.substring(0, 20)}`}</span>
          </div>
          <div className='d-flex flex-row align-items-center'>
            <span className='d-block'>
              <button onClick={incre}>+</button>
              <input className='col-md-2' style={{ padding: '2px' }} type={Number} min="0" value={quantity} required
  title="Please enter a quantity" onChange={q_Change} />
              <button onClick={dcre}>-</button>X{product.price}={quantity * product.price}
            </span>

            <i className="fa fa-trash-o" onClick={() => delItem(product.id)}></i>

          </div>
        </div>
      </div>
    </>
  );
}

const ShowCart = () => {
  const [state, dispatch] = useContext(CartContext);
  const {v_cart} = state;
  const delItem = (id) => {
    dispatch({ type: 'DEL_ITEM', payload: id });
    dispatch({ type: 'GET_TOTAL' });
  };
  return (
    <>
      {v_cart.map((product) => {
        return <CartDesign product={product} delItem={delItem} key={product.id} />;
      })}
    </>
  );
};

export default function Cart(){
    const [state,dispatch]=useContext(CartContext);
    return(
        <div className='container mt-5 p-3 rounded cart'>
            <div className='row no gutters'>
                <div className='col-md-8'>
                    <div className='product-details mr-2'>
                        <h1 className='mb-0'>Shopping Cart</h1>
                        <br/>
                        <div className='d-flex justiy-content-between'>
                            <span>You have {state.v_cart.length} items in your cart</span>
                            </div>
                            <ShowCart/>
                            <hr/>
                            <hr/>
                            <div className='fw-bold fs-25'>
                                Total={state.total}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}