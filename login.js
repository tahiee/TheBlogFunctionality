import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./config.js";


const form = document.querySelector('form')
const email = document.querySelector('#email')
const password = document.querySelector('#password')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email.value, password.value)    
    .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            window.location = 'home.html'
            alert('SingIn Successfully')
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
})
