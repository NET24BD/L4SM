// ==============================
// GOOGLE SCRIPT URL
// ==============================

const API_URL =
"https://script.google.com/macros/s/AKfycbxRQLGuRc-P8bZ2FE-6ua8B1iPH6IQ1tAffS0erigyv15xQSALef2nrNTSqdMOYHt1fqg/exec";



// ==============================
// LOAD SUPPORT DATA
// ==============================

document.addEventListener("DOMContentLoaded",()=>{

loadSupport();

});





function loadSupport(){


let list =
document.getElementById("supportList");


list.innerHTML =
`
<tr>
<td colspan="7">
Loading...
</td>
</tr>
`;




fetch(API_URL,{

method:"POST",

body:JSON.stringify({

action:"getPendingSupport"

})

})

.then(res=>res.json())

.then(data=>{


list.innerHTML="";



if(data.status==="success"){



if(data.data.length===0){


list.innerHTML=
`
<tr>
<td colspan="7">
No Pending Support
</td>
</tr>
`;


return;


}




data.data.forEach(row=>{


let tr=document.createElement("tr");



tr.innerHTML=`

<td>
${row.customerId}
</td>


<td>
${row.problem}
</td>


<td>
${row.reference}
</td>


<td>
${row.date}
</td>



<td>

<input 
type="text"
class="support"
value="${localStorage.getItem("username") || ''}"
readonly>

</td>



<td>

<textarea
class="work"
placeholder="Support Work"></textarea>

</td>



<td>

<button 
class="save-btn"
onclick="submitSupport(${row.row})">

Save

</button>


</td>

`;



list.appendChild(tr);



});



}

else{


list.innerHTML=
`
<tr>
<td colspan="7">
${data.message}
</td>
</tr>
`;


}



})


.catch(err=>{


console.log(err);


list.innerHTML=
`
<tr>
<td colspan="7">
Server Error
</td>
</tr>
`;


});



}








// ==============================
// SUBMIT SUPPORT
// ==============================


function submitSupport(row){



let tr =
event.target.closest("tr");



let support =
tr.querySelector(".support").value;



let work =
tr.querySelector(".work").value.trim();



if(work===""){


alert("Write Support Work");

return;


}





fetch(API_URL,{


method:"POST",


body:JSON.stringify({


action:"updateSupport",


row:row,


support:support,


supportWork:work,


username:
localStorage.getItem("username")


})


})


.then(res=>res.json())


.then(data=>{


if(data.status==="success"){


alert("Support Updated Successfully");


loadSupport();


}

else{


alert(data.message);


}


})

.catch(()=>{


alert("Server Error");


});



}
