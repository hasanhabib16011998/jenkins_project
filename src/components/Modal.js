import React from 'react';
import { NavLink } from 'react-router-dom';
import { CModal,CModalHeader,CModalTitle,CModalBody,CCard,CCardImage,CCardBody,CCardTitle,CCardText,CModalFooter,CButton } from '@coreui/react';
import { CartContext } from './context/cartContext';
import { useContext,useEffect,useState } from 'react';
import _ from 'lodash';
import axios from 'axios';
export default function Modal(){
    const [state,dispatch]=useContext(CartContext);
    const [product,setProduct]=useState([]);
    const [loading,setLoading]=useState(true);
    const [id,setId]=useState(state.p_id);
    const [visible,setVisible]=useState(state.bool);

    const handleClose=()=>{
        dispatch({type:"MODAL"})
    }

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

    if(loading){
        <div>Loading...</div>
    }
    else{


    return(
        <>
        <CModal alignment="center" visible={visible} onClose={handleClose}>
            <CModalHeader>
                <CModalTitle>
                    {product.title}
                </CModalTitle>
            </CModalHeader>

            <CModalBody>
                <CCard className='mb-3'>
                    <CCardImage orientation='top' src={product.image} style={{"height":"300px","width":"350px"}}/>
                    <CCardBody>
                        <CCardTitle>${product.price}</CCardTitle>
                        <CCardText>{product.description}</CCardText>
                        <CCardText>Category: {product.category}</CCardText>
                    </CCardBody>
                </CCard>
            </CModalBody>

            <CModalFooter>
                <NavLink to='/'><CButton color="secondary" onClick={handleClose}>Close</CButton></NavLink>
                <CButton color="primary" onClick={AddItem}>
                    <i class="cls-cart-arrow-down">Add to Cart</i>
                </CButton>
            </CModalFooter>

        </CModal>
        </>
    )
        
    }
}