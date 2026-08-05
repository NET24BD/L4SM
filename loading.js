// ===============================
// COMMON LOADING SYSTEM
// ===============================


let loadingInterval;



// ===============================
// LOAD COMMON LOADING HTML
// ===============================


function loadLoading(){


    let area = document.getElementById("loadingArea");


    if(!area){

        return;

    }



    fetch("loading.html")


    .then(response=>response.text())


    .then(data=>{


        area.innerHTML=data;


    })

    .catch(error=>{


        console.log("Loading File Error:",error);


    });


}





// ===============================
// SHOW LOADING
// ===============================


function showLoading(text="Loading..."){



    let box =
    document.getElementById("loadingBox");



    if(!box){

        console.log("Loading box not found");

        return;

    }





    box.style.display="block";



    document.getElementById("loadingText").innerHTML=text;



    let count=0;



    document.getElementById("percent").innerHTML="0%";


    document.getElementById("progressBar").style.width="0%";





    clearInterval(loadingInterval);





    loadingInterval=setInterval(()=>{


        if(count < 100){


            count++;



            document.getElementById("percent").innerHTML=
            count+"%";



            document.getElementById("progressBar").style.width=
            count+"%";



        }



    },25);






}







// ===============================
// HIDE LOADING
// ===============================


function hideLoading(){



    clearInterval(loadingInterval);




    let percent =
    document.getElementById("percent");



    let bar =
    document.getElementById("progressBar");





    if(percent){

        percent.innerHTML="100%";

    }



    if(bar){

        bar.style.width="100%";

    }







    setTimeout(()=>{


        let box =
        document.getElementById("loadingBox");



        if(box){


            box.style.display="none";


        }



    },400);




}







// ===============================
// AUTO LOAD
// ===============================


document.addEventListener(
"DOMContentLoaded",
function(){


    loadLoading();


});
