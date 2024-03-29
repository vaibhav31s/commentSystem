import React, {useState, useEffect} from 'react'
import axios from 'axios';
const LoginTest = () => {
    const { REACT_APP_BACKEND_URL } = process.env;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(null);
    const submitHandler = async (e) => {
        // e.preventDefault();

        const res = await axios.post(`${REACT_APP_BACKEND_URL}/login`, {
            email,
            password
        })

        //  console.log(res)
        }
        
    


  return (
    <div>
        <input type="text" placeholder="Enter your email" onChange={(e)=>{
            setEmail(e.target.value)
        }} />
        <input type="password" placeholder="Enter your password" onChange={(e)=>{
            setPassword(e.target.value)  
        }}/>
        <button
        onClick={()=>{
            submitHandler()
        }
        }
            >Login</button>
    </div>
  )
    }


export default LoginTest