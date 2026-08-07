(function(){

    let auth = localStorage.getItem("auth");


    if(auth !== "true"){

        window.location.href = "index.html";

    }


})();
