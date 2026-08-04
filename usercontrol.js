// 🔴 এখানে আপনার Google Apps Script Web App URL টি বসান
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

let allUsers = [];

const userTableBody = document.getElementById("userTableBody");
const userModal = document.getElementById("userModal");
const userForm = document.getElementById("userForm");
const loadingOverlay = document.getElementById("loading");
const searchInput = document.getElementById("searchUser");

const totalUsersEl = document.getElementById("totalUsers");
const activeUsersEl = document.getElementById("activeUsers");
const inactiveUsersEl = document.getElementById("inactiveUsers");

document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById("refreshBtn").addEventListener("click", fetchUsers);
  document.getElementById("addUserBtn").addEventListener("click", () => openModal());
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
  userForm.addEventListener("submit", handleSaveUser);
  searchInput.addEventListener("input", filterUsers);
}

// ১. গুগল শিট থেকে ইউজার লোড করা
async function fetchUsers() {
  showLoading(true);
  try {
    const res = await fetch(`${SCRIPT_URL}?action=getUsers`);
    const data = await res.json();

    if (data.success) {
      allUsers = data.users;
      renderTable(allUsers);
      updateDashboardCards(allUsers);
    } else {
      showToast(data.message || "Failed to load users", true);
    }
  } catch (err) {
    showToast("Error connecting to Google Sheets!", true);
  } finally {
    showLoading(false);
  }
}

// ২. টেবিল রেন্ডার করা
function renderTable(users) {
  if (!users || users.length === 0) {
    userTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No users found.</td></tr>`;
    return;
  }

  userTableBody.innerHTML = users.map((u, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <img src="${u.picture || 'https://i.imgur.com/2DhmtJ4.png'}" 
             alt="User" style="width:35px; height:35px; border-radius:50%; object-fit:cover;">
      </td>
      <td><strong>${escapeHtml(u.username)}</strong></td>
      <td>••••••</td>
      <td>${escapeHtml(u.name)}</td>
      <td><span class="badge">${escapeHtml(u.role)}</span></td>
      <td><span class="badge status-${(u.status || '').toLowerCase()}">${escapeHtml(u.status)}</span></td>
      <td>
        <button class="btn-icon text-blue" onclick="editUser(${u.rowNumber})" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon text-red" onclick="deleteUser(${u.rowNumber})" title="Delete">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

// ৩. ড্যাশবোর্ডের সংখ্যা আপডেট
function updateDashboardCards(users) {
  totalUsersEl.innerText = users.length;
  activeUsersEl.innerText = users.filter(u => u.status === "Active").length;
  inactiveUsersEl.innerText = users.filter(u => u.status !== "Active").length;
}

// ৪. নতুন ইউজার সেভ বা এডিট করা
async function handleSaveUser(e) {
  e.preventDefault();
  showLoading(true);

  const rowNumber = document.getElementById("row").value;

  const payload = {
    action: "saveUser",
    rowNumber: rowNumber ? parseInt(rowNumber) : null,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    name: document.getElementById("name").value,
    role: document.getElementById("role").value,
    status: document.getElementById("status").value,
    picture: document.getElementById("picture").value
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      showToast(data.message, false);
      closeModal();
      fetchUsers();
    } else {
      showToast(data.message, true);
    }
  } catch (err) {
    showToast("Failed to save user data!", true);
  } finally {
    showLoading(false);
  }
}

// ৫. মোডাল কন্ট্রোল
function openModal(user = null) {
  document.getElementById("modalTitle").innerText = user ? "Edit User" : "Add New User";
  document.getElementById("row").value = user ? user.rowNumber : "";
  document.getElementById("username").value = user ? user.username : "";
  document.getElementById("password").value = user ? user.password : "";
  document.getElementById("name").value = user ? user.name : "";
  document.getElementById("role").value = user ? user.role : "User";
  document.getElementById("status").value = user ? user.status : "Active";
  document.getElementById("picture").value = user ? user.picture : "";

  userModal.classList.add("active");
}

function closeModal() {
  userModal.classList.remove("active");
  userForm.reset();
}

function editUser(rowNumber) {
  const user = allUsers.find(u => u.rowNumber === rowNumber);
  if (user) openModal(user);
}

// ৬. ইউজার ডিলিট
async function deleteUser(rowNumber) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  showLoading(true);
  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "deleteUser", rowNumber: rowNumber })
    });
    const data = await res.json();

    if (data.success) {
      showToast(data.message, false);
      fetchUsers();
    } else {
      showToast(data.message, true);
    }
  } catch (err) {
    showToast("Error deleting user!", true);
  } finally {
    showLoading(false);
  }
}

// ৭. ফিল্টার/সার্চ
function filterUsers() {
  const query = searchInput.value.toLowerCase();
  const filtered = allUsers.filter(u => 
    (u.name && u.name.toLowerCase().includes(query)) ||
    (u.username && u.username.toLowerCase().includes(query)) ||
    (u.role && u.role.toLowerCase().includes(query))
  );
  renderTable(filtered);
}

// Helpers
function showLoading(show) {
  loadingOverlay.style.display = show ? "flex" : "none";
}

function showToast(msg, isError = false) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.className = `toast ${isError ? 'error' : 'success'} show`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}
