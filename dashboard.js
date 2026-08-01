// Card Page Open

function openPage(page){

    window.location.href = page;

}



// Login থেকে user data নিলে এখানে দেখাবে

let username = localStorage.getItem("username");

let photo = localStorage.getItem("photo");



if(username){

    document.getElementById("username").innerHTML = username;

}


if(photo){

    document.getElementById("profileImg").src = photo;

}
