import { React,useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { cartContext } from './context/cartContext'

export default function sidebar(){

    return(
        <>
        <section id='sidebar'>
            <div>
                <h6 className='p-1 border-bottom'>
                    Category
                </h6>

                <ul>
                    <li><button className='btn btn-outline-dark' onClick={()=>setfilter(data)}>All</button></li>
                    <li><button className='btn btn-outline-dark' onClick={()=>{filterProduct("men's clothing")}}></button></li>
                    <li><button className='btn btn-outline-dark' onClick={()=>{filterProduct("women's clothing")}}>Women</button></li>
                    <li><button className='btn btn-outline-dark' onClick={()=>{filterProduct("jewelary")}}>Jewelary</button></li>
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
                    <label className='pl-1 pt-sm-0 pt-1'>$1---$75</label>
                </div>
                <div className='form-inline border-rounded p-sm-2 my-2'>
                    <input type='radio' name='type'/>
                    <label className='pl-1 pt-sm-0 pt-1'>$76---$150</label>
                </div>
                <div className='form-inline border-rounded p-sm-2 my-2'>
                    <input type='radio' name='type'/>
                    <label className='pl-1 pt-sm-0 pt-1'>$151---$1000</label>
                </div>
            </div>

        </section>
        </>
    )

}