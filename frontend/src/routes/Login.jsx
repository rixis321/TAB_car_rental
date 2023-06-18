import React, {useContext, useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";
import api from '../api/axiosConfig';
import {useNavigate} from "react-router";

const LOGIN_URL = "api/customer/login"

const Login = () => {
    const navigate = useNavigate()
    const emailRef = useRef()
    const{setAuth} = useContext(AuthContext)
    const[email,setEmail] = useState("")
    const[passwd, setPasswd] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const[success,setSuccess] = useState(false)

    useEffect(()=>{
        emailRef.current.focus()
    },[])
    useEffect(()=>{
        setErrMsg("")
    },[email,passwd])

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const response = await api.post(LOGIN_URL,
                JSON.stringify({email:email,password:passwd}),
                {
                    headers: {'Content-Type': "application/json"},
                    //withCredentials: true
                }
            );
           // console.log(JSON.stringify(response?.data))

            const accessToken = response?.data
            setAuth({email,passwd,accessToken});
            setEmail("")
            setPasswd("")
            navigate("/")
        }catch (err){

            if(!err?.response){
                setErrMsg("No Server Response");

            }else if(err.response?.status === 400){
                setErrMsg("Missing Username or Password")
            }else if(err.response?.status === 401){
                setErrMsg("Unauthorized")
            }else{
                setErrMsg("Incorrect data. Try again")
            }
            emailRef.current.focus();
        }
    }

    return (
        <section>
           <p >{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e)=> setEmail(e.target.value)}
                    value={email}
                    required
                />
            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                onChange={(e)=> setPasswd(e.target.value)}
                value={passwd}
                required
            />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?
                <span>
                    <Link to={"/Register"}>
                        Sign Up
                    </Link>

                </span>

            </p>
        </section>
    );
};

export default Login;