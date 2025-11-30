import UserLayout from '@/layout/UserLayout'
import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./style.module.css"
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {


const authState = useSelector((state) => state.auth)

const [userLoginMethod, setUserLoginMethod] = useState(false);

const router = useRouter();

const [email, setEmailAddress] = useState("");
const [password, setPassword] = useState("");
const [username , setUsername] = useState("");
const [name, setName] = useState("");

const dispath = useDispatch();
 useEffect(() => {
  const token = localStorage.getItem("token");

  if (authState.loggedIn || token) {
    router.push("/dashboard");
  }
}, [authState.loggedIn]);

  useEffect(() =>{
   dispath(emptyMessage())
  },[userLoginMethod])
  
  const handleRegister = () =>{
     console.log("hello")
    dispath(registerUser({username, password, email, name}))
  }

  const handleLogin = () =>{
    console.log("loggin")
    dispath(loginUser({email, password}))
  }
  return (
    <UserLayout>
     <div className={styles.container}>
      <div className={styles.cardContainer}>

    <div className={styles.cardContainer_left}>
    
        <p className= {styles.cardLeft_Heading} > {userLoginMethod ? "Sign In" : "Sign Up"} </p>

        <p style={{color: authState.isError ? "red" : " green"}}>

        {authState.message.message}
        </p>

        <div className={styles.inputContainer}>

          { !userLoginMethod &&  <div className={styles.inputRow}>
          
              <input onChange={(e) => setUsername(e.target.value)} className={styles.inputfield} type="text"  placeholder='Username'/>
              <input onChange={(e) => setName(e.target.value)} className={styles.inputfield} type="text"  placeholder='Name'/>

           </div> }


          <input onChange={(e) => setEmailAddress(e.target.value)} className={styles.inputfield} type="email"  placeholder='email'/>

          <input onChange={(e) => setPassword(e.target.value)} className={styles.inputfield} type="password"  placeholder='password'/>


        <div onClick={ () => {
          if(userLoginMethod){
             handleLogin();
          }else{
            handleRegister();
          }
        }} className={styles.buttonWithoutline}>
          <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
        </div>
        </div>
      </div>

      <div className={styles.cardContainer_right}>  
         
          {
            userLoginMethod ? <p>Don't Have an Account</p> :
          <p>Already Logged In</p>
          }
          <div onClick={ () => {
          setUserLoginMethod(!userLoginMethod)
        }} className={styles.buttonWithoutline}>
          <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
        </div>
           
      </div>


      </div>
      </div>
    </UserLayout>
  )
}

export default LoginComponent