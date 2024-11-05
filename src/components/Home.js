import React,{ useState,useEffect } from 'react'
import Products from './Products'
import './Home.css'
import Banner from './Banner'
//import banner from '../assets/banner.jpg'

export default function Home(){
    return(
        <div className='hero'>
            <div className='card bg-dark text-white'>
                <Banner/>
                
            </div>

            <Products/>

        </div>

    )
}