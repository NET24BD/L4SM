// =======================================
// L4SM GLOBAL SESSION CONTROL
// =======================================


// 10 Minutes Session Time

const SESSION_LIMIT = 10 * 60 * 1000;




// =======================================
// LOGIN CHECK
// =======================================

if(localStorage.getItem("isLogin") !== "true"){


    window.location.href = "login.html";


}






// =======================================
// UPDATE USER ACTIVITY
// =======================================

function updateActivity(){



    localStorage.setItem(
        "lastActivity",
        Date.now()
    );


}








// =======================================
// CHECK SESSION
// =======================================

function checkSession(){



    let lastActivity =
    localStorage.getItem("lastActivity");




    if(!lastActivity){


        updateActivity();

        return;


    }





    let inactiveTime =
    Date.now() - Number(lastActivity);





    if(inactiveTime >= SESSION_LIMIT){


        logoutUser();


    }



}









// =======================================
// LOGOUT
// =======================================

function logoutUser(){



    localStorage.removeItem("isLogin");

    localStorage.removeItem("username");

    localStorage.removeItem("name");

    localStorage.removeItem("role");

    localStorage.removeItem("picture");

    localStorage.removeItem("lastActivity");



    window.location.href =
    "login.html";



}









// =======================================
// USER ACTIVITY DETECTOR
// =======================================


const activityEvents = [


    "click",

    "mousemove",

    "keydown",

    "scroll",

    "touchstart"


];





activityEvents.forEach(function(event){



    document.addEventListener(
        event,
        updateActivity
    );



});









// =======================================
// AUTO CHECK EVERY 1 MINUTE
// =======================================


setInterval(function(){


    checkSession();


},60000);









// =======================================
// FIRST PAGE LOAD
// =======================================


if(
!localStorage.getItem("lastActivity")
){


    updateActivity();


}
