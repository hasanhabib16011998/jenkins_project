import React from 'react'
import { useReducer,createContext} from 'react';

export const CartContext=createContext();

const initialState={
    v_cart:[],
    total:0,
    isLoggedIn:true,
    r_data:[],
    n_id:0,
    p_id:0,
    bool:false,

}


const reducer=(state = initialState, action)=>{
    switch(action.type){
        case "ADD_ITEM":
            var exists=0;
            if(state.v_cart.length>0){
                exists=state.v_cart.filter(cart=>cart.id===action.payload.id)//Checks if that product id already exists in v_cart
            }
            else{
                exists=[]
            }

            if(exists.length===0){
                let cart=[...state.v_cart,action.payload]
                return{...state,v_cart:[...cart]}
                //action.payload contains the clicked product. that payload is inserted into vcart
            }
            else{
                return state;
            }
        case "DEL_ITEM":
            let v_cart=state.v_cart.filter(cart=>cart.id!==action.payload)
            //keeps only the products that doesnt match with the selected product to be deleted
            return{...state,v_cart:[...v_cart]}
        case "ADD_QTY":
            let obj=state.v_cart.filter(cart=>cart.id===action.payload.id);
            let index=state.v_cart.indexOf(obj[0]);
            state.v_cart[index].qty=action.payload.qty;
            let cart=[...state.v_cart];
            return {...state,v_cart:[...cart]}
        case "GET_TOTAL":
            if(state.v_cart.length<=0){
                state.total=0;
                return state;
            }
            else{
                var sum=0;
                for(let i=0;i<state.v_cart.length;i++){
                    sum+=state.v_cart[i].price*state.v_cart[i].qty;
                }
                state.total=sum;
                return state;
            }
        case "P_ID":
            return{...state,p_id:action.payload};
        case "MODAL":
            return{...state,bool:!state.bool};
    }
}
export default function CartContextProvider(props){
    const [state,dispatch]=useReducer(reducer,initialState);
    return(
        <CartContext.Provider value={[state,dispatch]}>
            {props.children}
        </CartContext.Provider>
    )
}