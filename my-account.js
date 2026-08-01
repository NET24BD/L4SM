let user = JSON.parse(localStorage.getItem("user"));



if(user){


document.getElementById("photo").src =
user.photo || "profile.png";


document.getElementById("name").innerHTML =
user.name || "No Name";


document.getElementById("role").innerHTML =
user.role || "User";



document.getElementById("username").innerHTML =
user.username || "---";


document.getElementById("fullname").innerHTML =
user.name || "---";


document.getElementById("userRole").innerHTML =
user.role || "---";


document.getElementById("department").innerHTML =
user.department || "---";


document.getElementById("email").innerHTML =
user.email || "---";


document.getElementById("phone").innerHTML =
user.phone || "---";


document.getElementById("address").innerHTML =
user.address || "---";


document.getElementById("joinDate").innerHTML =
user.joinDate || "---";


}




function logout(){

localStorage.clear();

window.location.replace("login.html");

}
