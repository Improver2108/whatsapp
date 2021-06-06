import React, { useState } from 'react'
import './Login.css'
import axios from "./axios";
import {Link} from 'react-router-dom';

function Login() {
    const [user,setUser]=useState(()=>'');
    const login=()=>{
        let user_id=prompt("Enter your user id");
        if(user_id){
            axios.get('/'+user_id).then(response=>{
                console.log(response.data);
                setUser(response.data);
            })
        }
        else
            alert("provide user id!!!");
                  
    }
    return (
        <div className="login">
            <button onClick={login}>Login</button>
            <Link to={{
                pathname:'/main',
                state:user
            }}>go to wp</Link>
        </div>
    )
}

export default Login
