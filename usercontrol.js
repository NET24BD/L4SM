// =====================================
// GOOGLE SCRIPT API URL
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec";




// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", function(){


    loadProfile();

    loadUsers();


});






// =====================================
// LOAD PROFILE
// =====================================

function loadProfile(){


    const name =
    localStorage.getItem("name");


    const picture =
    localStorage.getItem("picture");



    const userName =
    document.getElementById("userName");


    const profileImg =
    document.getElementById("profileImg");



    if(userName){

        userName.innerHTML =
        name || "User";

    }



    if(profileImg && picture){

        profileImg.src = picture;

    }



}







// =====================================
// PROFILE MENU
// =====================================


const profileBtn =
document.getElementById("profileBtn");


const profileMenu =
document.getElementById("profileMenu");



if(profileBtn){


profileBtn.addEventListener("click",function(e){


    e.stopPropagation();


    if(profileMenu.style.display==="block"){


        profileMenu.style.display="none";


    }
    else{


        profileMenu.style.display="block";


    }


});


}





document.addEventListener("click",function(){


    if(profileMenu){

        profileMenu.style.display="none";

    }


});








// =====================================
// BACK BUTTON
// =====================================


const backBtn =
document.getElementById("backBtn");



if(backBtn){


backBtn.onclick=function(){


    window.location.href="dashboard.html";


};


}








// =====================================
// MY ACCOUNT
// =====================================


const accountBtn =
document.getElementById("accountBtn");



if(accountBtn){


accountBtn.onclick=function(e){


    e.stopPropagation();


    window.location.href="my-account.html";


};


}








// =====================================
// LOGOUT
// =====================================


const logoutBtn =
document.getElementById("logoutBtn");



if(logoutBtn){


logoutBtn.onclick=function(){


    localStorage.clear();


    window.location.href="login.html";


};


}









// =====================================
// LOAD USERS FROM GOOGLE SHEET
// =====================================


function loadUsers(){



fetch(API_URL + "?action=users")



.then(response=>response.json())



.then(users=>{


console.log("USERS:",users);



const table =
document.getElementById("userTable");



if(!table){

return;

}



table.innerHTML="";





users.forEach(function(user){



let img =
user.picture && user.picture !== ""
?
user.picture
:
"profile.png";





table.innerHTML += `



<tr>



<td>


<img class="user-photo" src="${img}">


</td>




<td>

${user.username}

</td>




<td>

${user.name}

</td>




<td>

${user.role}

</td>




<td>

${user.status}

</td>




<td>


<button class="action-btn edit">

Edit

</button>



<button class="action-btn delete">

Delete

</button>



</td>



</tr>



`;



});




})



.catch(error=>{


console.log("ERROR:",error);



const table =
document.getElementById("userTable");



if(table){


table.innerHTML=`

<tr>

<td colspan="6">

Connection Error

</td>

</tr>

`;

}



});



}









// =====================================
// ADD USER
// =====================================


const addUserBtn =
document.getElementById("addUserBtn");



if(addUserBtn){


addUserBtn.onclick=function(){


alert("Add User System Coming Soon");


};


}
