import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

function App() {
  const [user,setUser]= useState({
    isSignIn:false,
    name:'',
    email:'',
    photo:'',

  })

  if (firebase.apps.length===0) {
      firebase.initializeApp(firebaseConfig); 
  }

  const googleSignIn=()=>{
    var provider = new firebase.auth.GoogleAuthProvider();
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
      }
      setUser(signOutUser)
      console.clear()
      console.log("sign out");
    }).catch((error) => {
      // An error happened.
    });
    
  }

  return (
    <div className="App">
      <h1>This is from App.js</h1>
   

     {
       user.isSignIn ?<button onClick={googleSignOut}> Sign out </button>:<button onClick={googleSignIn}> Sign in </button>
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
    </div>
  );
}

export default App;
