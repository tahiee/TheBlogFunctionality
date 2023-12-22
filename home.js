import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// check user login or not
let arr = []
let userUid;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid)
        userUid = uid
        const q = query(collection(db, "Blogs"), where("uid", "==", uid), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            arr.push({ ...doc.data(), docId: doc.id })
        });
        renderTheBlog()
    } else {
        window.location = 'login.html'
    }
});

const form = document.querySelector('form')
const name = document.querySelector('#blog-name')
const desc = document.querySelector('#blog-desc')
const div = document.querySelector('.container')

// create a randerblog function

// function renderTheBlog() {
//     div.innerHTML = '';
//     console.log(arr);
//     arr.forEach((item, index) => {
//         const blogElement = document.createElement('div')
//         blogElement.innerHTML += `
//         <h1>Title: ${item.name}</h1>
//         <h1>Description: ${item.desc}</h1>
//         <button class="deleteBtn" data-index="${index}">delete</button>
//         <button class="editBtn" data-index="${index}">Update</button>
//         `
//         div.appendChild(blogElement)
//     })
// }

// // delete listner
// div.addEventListener('click', (event) => {
//     if (event.target.classList.contains('deleteBtn')) {
//         const dataIndex = event.target.getAttribute('data-index')
//         console.log('delete called', dataIndex)
//         deleteBlog(dataIndex)
//     } else if (event.target.classList.contains('editBtn')) {
//         const dataIndex = event.target.getAttribute('data-index')
//         console.log('edit called', dataIndex)
//     }

//     // creating newtitle & newdec
//     const newName = prompt('Enter new Title')
//     const newDesc = prompt('Enter new Descripition')

//     if (newName !== null && newDesc !== null) {
//         arr[dataIndex].name = newName
//         arr[dataIndex].desc = newDesc
//         renderTheBlog()
//     } updateDoc(doc(db, 'Blogs', arr[dataIndex].docId), {
//         name: newName,
//         desc: newDesc,
//         timestamp: Timestamp.fromDate(new Date()),
//     });
//     renderTheBlog()
// })



function renderTheBlog() {
    div.innerHTML = '';
    console.log(arr);
    arr.forEach((item, index) => {
        const blogElement = document.createElement('div');
        blogElement.innerHTML = `
            <h1>Title: ${item.name}</h1>
            <h1>Description: ${item.desc}</h1>
            <button class="deleteBtn" data-index="${index}">delete</button>
            <button class="editBtn" data-index="${index}">Update</button>
        `;
        div.appendChild(blogElement);
    });
}

// delete listner & update
div.addEventListener('click', (event) => {
    if (event.target.classList.contains('deleteBtn')) {
        const dataIndex = event.target.getAttribute('data-index');
        console.log('delete called', dataIndex);
        deleteBlog(dataIndex);
    } else if (event.target.classList.contains('editBtn')) {
        const dataIndex = event.target.getAttribute('data-index');
        console.log('edit called', dataIndex);

        // Prompt the user for new title and description
        const newTitle = prompt('Enter new title:');
        const newDescription = prompt('Enter new description:');

        if (newTitle !== null && newDescription !== null) {
            // Update the array and re-render
            arr[dataIndex].name = newTitle;
            arr[dataIndex].desc = newDescription;
            renderTheBlog();
        } updateDoc(doc(db, 'Blogs', arr[dataIndex].docId), {
            name: newTitle,
            desc: newDescription,
            timestamp: Timestamp.fromDate(new Date()),
        });
        renderTheBlog()
    }
});


//add Data Firebase
form.addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const docRef = await addDoc(collection(db, "Blogs"), {
            name: name.value,
            desc: desc.value,
            uid: auth.currentUser.uid,
            timestamp: Timestamp.fromDate(new Date()),
        });
        console.log("Document written with ID: ", docRef.id);
        arr.unshift({
            name: name.value,
            desc: desc.value,
            uid: userUid,
            docId: docRef.id
        })
        renderTheBlog()
    } catch (error) {
        console.log(error)
    }
})



// delete belog function
function deleteBlog(index) {
    deleteDoc(doc(db, 'Blogs', arr[index].docId))
        .then(() => {
            arr.splice(index, 1)
            renderTheBlog()
        }).catch((err) => {
            console.log(err)
        })
    renderTheBlog()
}




// logout function
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    signOut(auth).then(() => {
        window.location = 'login.html'
    }).catch((error) => {
        console.log(error)
    });
})