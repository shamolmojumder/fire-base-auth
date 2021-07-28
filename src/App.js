import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

function App() {
  const [user,setUser]= useState({
    isSignIn:false,
    newUser:false,
    name:'',
    email:'',
    password:'',
    photo:'',
    // error:'',
    // success:false
  })

  if (firebase.apps.length===0) {
      firebase.initializeApp(firebaseConfig); 
  }
  var provider = new firebase.auth.GoogleAuthProvider();
  const handleGoogle=()=>{
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      const {displayName,email,photoURL}=result.user;
      var user = result.user;
      const signInUser ={
        isSignIn:true,
        name:displayName,
        email:email,
        photo:photoURL,
      }  
      setUser(signInUser)
      console.log("sign in ",user.displayName);
      // ...
    }).catch((error) => {
      console.log(error);
    });
  }
  const googleSignOut = ()=>{
    firebase.auth().signOut().then((res) => {
      // Sign-out successful.
      const signOutUser={
        isSignIn:false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
      }
      setUser(signOutUser)
      console.clear()
      console.log("sign out");
    }).catch((error) => {
      // An error happened.
    });
    
  }
  const handleChange=(e)=>{
    //debugger;
    let isFieldValid =true;
    // console.log(e.target.name,e.target.value);
    if (e.target.name === "email") {
      isFieldValid =/\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      // Without it, your current regex only matches that you have 6 to 16 valid characters, it doesn't validate that it has at least a number, and at least a special character. That's what the lookahead above is for
      // const isPasswordValid =/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(e.target.value)
      // console.log(isPasswordValid);
      // -ignore
      const isPasswordValid =e.target.value.length>6;
      const passwordHasNumber= /\d{1}/.test(e.target.value)
        isFieldValid=isPasswordValid && passwordHasNumber;
    }if(isFieldValid){
      const newUserInfo={...user};
      newUserInfo[e.target.name]=e.target.value;
      setUser(newUserInfo)
    }
  }

  const handleSubmit= (e)=>{
    console.log(user.email , user.password);
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        const newUserInfo={...user};
        newUserInfo.error='';
        newUserInfo.success=true
        setUser(newUserInfo)
        // Signed in 
        console.log(res);
        // var user = res.user;
        // ...
      })
      .catch((error) => {
        const newUserInfo={...user};
        newUserInfo.error=error.message;
        newUserInfo.success=false
        setUser(newUserInfo);
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // console.log(errorCode,errorMessage);
        // ..
      });
    }
    e.preventDefault();
    
  }
  return (
    <div className="App">
      <h1>This is from App.js</h1>
   

     {
       user.isSignIn ?<button onClick={googleSignOut}> Sign out </button>:<button onClick={handleGoogle}> Sign in </button>
       //user.isSignIn initial value is false
      // ternary operation is like condtion? true:false
      // so is isSignIn condtion is false that's mean there is no user.Sign in will show 
     }
    {
      user.isSignIn&& <div>
        <p>Welcome {user.name} </p>
        <p> email: {user.email} </p>
        <img src={user.photo} alt="" />
      </div>
    }
    <h1>Our Own Authentication</h1>
    {/* <p> {user.email}{user.password} </p> */}
    <input type="checkbox" onChange={toggle} name="newUser" id="" />
    <label htmlFor="newUser">New User Sign in</label>
    <form onSubmit={handleSubmit}>
      {user.newUser && <input type="text" name="name" id="" onBlur={handleChange} placeholder="Your name" />}
      <br />
      <input type="text" name="email" id="" onBlur={handleChange} placeholder="email" required/>
      <br />
      <input type="password" name="password" id="" onBlur={handleChange} placeholder="password" required/>
      <br />
      <input type="submit" value="Submit" />
    </form>
    <p style={{color:'red'}}> {user.error} </p>
    {
      user.success && <p style={{color:'green'}}> User created successfully </p>
    }
    </div>
  );
}

export default App;
