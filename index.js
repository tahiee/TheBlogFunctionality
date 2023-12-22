import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db , storage } from "./config.js";
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js'

const form = document.querySelector('form');
const email = document.querySelector('#exampleInputEmail1')
const password = document.querySelector('#exampleInputPassword1')
const userName = document.querySelector('#exampleInputname')


form.addEventListener('submit', (event) => {
    event.preventDefault()
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user)
            try {
                const docRef = await addDoc(collection(db, "users"), {
                    name: userName.value,
                    email: email.value,
                    password: password.value,
                    uid: user.uid
                });
                alert('Register Successfully')
                console.log("Document written with ID: ", docRef.id);
                window.location = 'login.html'
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });

})

const btn = document.querySelector("#btn2")
const file = document.querySelector('#file')
// firebase storage
btn.addEventListener('click', () => {
    const files = file.files[0];
    console.log(files);
    const storageRef = ref(storage, email.value);
    uploadBytes(storageRef, files).then(() => {
        getDownloadURL(storageRef).then((url) => {
            console.log(url);
        }).catch((err) => {
            console.log(err);
        })
    }).catch((err) => {
        console.log(err);
    })
})
