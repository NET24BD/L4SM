// =====================================
// L4SM SESSION MANAGEMENT
// =====================================


// ================================
// LOGIN CHECK
// ================================

if(localStorage.getItem("isLogin") !== "true"){


window.location.href="login.html";


}





// ================================
// SESSION TIME
// 10 MINUTES
// ================================


const SESSION_TIME = 10 * 60 * 1000;


let sessionTimer;





// ================================
// RESET TIMER
// ================================

function resetSessionTimer(){


clearTimeout(sessionTimer);



sessionTimer = setTimeout(function(){



logoutUser();



}, SESSION_TIME);



}









// ================================
// AUTO LOGOUT
// ================================

function logoutUser(){



localStorage.removeItem("isLogin");

localStorage.removeItem("username");

localStorage.removeItem("name");

localStorage.removeItem("role");

localStorage.removeItem("picture");





alert(
"Session Expired. Please Login Again"
);




window.location.href="login.html";



}









// ================================
// USER ACTIVITY
// ================================


window.addEventListener(
"load",
resetSessionTimer
);



window.addEventListener(
"mousemove",
resetSessionTimer
);



window.addEventListener(
"click",
resetSessionTimer
);



window.addEventListener(
"keypress",
resetSessionTimer
);



window.addEventListener(
"scroll",
resetSessionTimer
);



window.addEventListener(
"touchstart",
resetSessionTimer
);









// ================================
// ROLE PAGE PROTECTION
// ================================



let role =
localStorage.getItem("role");



let page =
window.location.pathname
.split("/")
.pop();






// ADMIN ONLY


if(
page==="usercontrol.html" &&
role!=="Admin"
){


alert(
"Access Denied"
);


window.location.href="dashboard.html";


}







// SUPPORT ONLY


if(
page==="support.html" &&
role!=="Admin" &&
role!=="Support"

){


alert(
"Access Denied"
);


window.location.href="dashboard.html";


}








// CALLER ONLY


if(
page==="call.html" &&
role!=="Admin" &&
role!=="Caller"

){


alert(
"Access Denied"
);


window.location.href="dashboard.html";


}









// MANAGER ONLY


if(
page==="manager.html" &&
role!=="Admin" &&
role!=="Manager"

){


alert(
"Access Denied"
);


window.location.href="dashboard.html";


}









// ================================
// LOGOUT BUTTON
// ================================


function logout(){


logoutUser();


}
