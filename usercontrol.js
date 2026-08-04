// 🔴 গুগল অ্যাপস স্ক্রিপ্ট থেকে পাওয়া আপনার আসল Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

let usersData = [];

document.addEventListener("DOMContentLoaded", () => {
  const session = localStorage.getItem("session_user");
  if (session) {
    showDashboard(JSON.parse(session));
  } else {
    showLogin();
  }
});

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById("loginBtn");
  btn.disabled = true;
  btn.innerText = "Processing...";

  const payload = {
    action: "login",
    username: document.getElementById("loginUsername").value.trim(),
    password: document.getElementById("loginPassword").value.trim()
  };

  try {
    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(payload) });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("session_user", JSON.stringify(data.user));
      showDashboard(data.user);
    } else {
      showLoginAlert(data.message);
    }
  } catch (err) {
    showLoginAlert("গুগল অ্যাপস স্ক্রিপ্ট কানেকশনে সমস্যা হচ্ছে!");
  } finally {
    btn.disabled = false;
    btn.innerText = "Login";
  }
}

function showDashboard(user) {
  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("dashboardView").classList.remove("hidden");

  document.getElementById("navName").innerText = user.name;
  document.getElementById("navRole").innerText = user.role;
  if (user.picture) document.getElementById("navPic").src = user.picture;

  loadUsers();
}

function showLogin() {
  document.getElementById("dashboardView").classList.add("hidden");
  document.getElementById("loginView").classList.remove("hidden");
}

async function loadUsers() {
  try {
    const res = await fetch(`${API_URL}?action=getUsers`);
    const data = await res.json();

    if (data.success) {
      usersData = data.users;
      renderTable(usersData);
      updateStats(usersData);
    }
  } catch (err) {
    alert("ইউজার ডাটা লোড করতে ব্যর্থ হয়েছে!");
  }
}

function renderTable(users) {
  const tbody = document.getElementById("userTableBody");
  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">কোনো ইউজার পাওয়া যায়নি!</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><img src="${u.picture || 'https://i.imgur.com/2DhmtJ4.png'}" class="user-img"></td>
      <td>${u.name}</td>
      <td><b>${u.username}</b></td>
      <td>••••••</td>
      <td>${u.role}</td>
      <td><span class="badge ${u.status}">${u.status}</span></td>
      <td>
        <button onclick="editUser(${u.rowNumber})" class="btn" title="Edit"><i class="fas fa-edit" style="color:#007bff;"></i></button>
        <button onclick="deleteUser(${u.rowNumber})" class="btn" title="Delete"><i class="fas fa-trash" style="color:#dc3545;"></i></button>
      </td>
    </tr>
  `).join("");
}

function updateStats(users) {
  document.getElementById("statTotal").innerText = users.length;
  document.getElementById("statActive").innerText = users.filter(u => u.status === "Active").length;
  document.getElementById("statBlocked").innerText = users.filter(u => u.status !== "Active").length;
}

async function saveUser(e) {
  e.preventDefault();
  const btn = document.getElementById("saveBtn");
  btn.disabled = true;

  const payload = {
    action: "saveUser",
    rowNumber: document.getElementById("rowNumber").value ? parseInt(document.getElementById("rowNumber").value) : null,
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value.trim(),
    name: document.getElementById("name").value.trim(),
    role: document.getElementById("role").value,
    status: document.getElementById("status").value,
    picture: document.getElementById("picture").value.trim(),
    userId: document.getElementById("userId").value
  };

  try {
    const res = await fetch(API_URL, { method: "POST", body: JSON.stringify(payload) });
    const data = await res.json();

    if (data.success) {
      closeModal();
      loadUsers();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("ডাটা সেভ করা সম্ভব হয়নি!");
  } finally {
    btn.disabled = false;
  }
}

function openModal(user = null) {
  document.getElementById("modalTitle").innerText = user ? "Edit User" : "Add New User";
  document.getElementById("rowNumber").value = user ? user.rowNumber : "";
  document.getElementById("userId").value = user ? user.userId : "";
  document.getElementById("username").value = user ? user.username : "";
  document.getElementById("password").value = user ? user.password : "";
  document.getElementById("name").value = user ? user.name : "";
  document.getElementById("role").value = user ? user.role : "User";
  document.getElementById("status").value = user ? user.status : "Active";
  document.getElementById("picture").value = user ? user.picture : "";

  document.getElementById("userModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("userModal").classList.add("hidden");
  document.getElementById("userForm").reset();
}

function editUser(rowNum) {
  const user = usersData.find(u => u.rowNumber === rowNum);
  if (user) openModal(user);
}

async function deleteUser(rowNumber) {
  if (!confirm("আপনি কি নিশ্চিত এই ইউজারটি ডিলিট করতে চান?")) return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "deleteUser", rowNumber })
    });
    const data = await res.json();
    if (data.success) loadUsers();
  } catch (err) {
    alert("ডিলিট করতে সমস্যা হয়েছে!");
  }
}

function searchUsers() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const filtered = usersData.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.username.toLowerCase().includes(query) ||
    u.role.toLowerCase().includes(query)
  );
  renderTable(filtered);
}

function logout() {
  localStorage.removeItem("session_user");
  showLogin();
}

function showLoginAlert(msg) {
  const alertEl = document.getElementById("loginAlert");
  alertEl.innerText = msg;
  alertEl.classList.remove("hidden");
}
