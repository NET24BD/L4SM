function openPage(page){

    window.location.href = page;

}


// Example User Data

let user = {

    name:"Fahim",
    photo:"profile.png"

};


document.getElementById("username").innerHTML = user.name;

document.getElementById("profileImage").src = user.photo;
