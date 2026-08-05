// =====================================
// GOOGLE APPS SCRIPT URL
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
// LOAD ADMIN PROFILE
// =====================================

function loadProfile(){


    let name = localStorage.getItem("name");

    let picture = localStorage.getItem("picture");



    let nameBox = document.getElementById("userName");

    let imgBox = document.getElementById("profileImg");



    if(nameBox){

        nameBox.innerHTML = name || "User";

    }



    if(imgBox && picture){

        imgBox.src = picture;

    }



}






// =====================================
// PROFILE DROPDOWN
// =====================================


const profileBtn = document.getElementById("profileBtn");

const profileMenu = document.getElementById("profileMenu");



if(profileBtn){


profileBtn.addEventListener("click",function(e){


    e.stopPropagation();


    if(profileMenu.style.display === "block"){


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


const backBtn = document.getElementById("backBtn");



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
// LOAD USERS FROM SHEET
// =====================================


function loadUsers(){



fetch(API_URL + "?action=users")


.then(response => response.json())


.then(users => {



console.log("USER DATA:",users);



const table =
document.getElementById("userTable");



if(!table){

console.log("userTable missing");

return;

}



table.innerHTML="";





if(users.length === 0){


table.innerHTML = `

<tr>

<td colspan="6">

No User Found

</td>

</tr>

`;

return;


}







users.forEach(function(user){



table.innerHTML += `

<tr>


<td>

<img src="${user.picture || 'profile.png'}">

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


console.log("API ERROR:",error);



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
// ADD USER BUTTON
// =====================================


const addUserBtn =
document.getElementById("addUserBtn");



if(addUserBtn){


addUserBtn.onclick=function(){


alert("Add User Coming Soon");


};


}
