// আপনার Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2-w0CK4IXldQfzUxjOTpN2m2knTH858fr8vMmcowbecL6UQ9oJVcAyoMMLb8GYbY/exec';

/**
 * লগইন ফাংশন
 * @param {string} username - ইউজারনেম
 * @param {string} password - পাসওয়ার্ড
 */
async function handleLogin(username, password) {
  const messageElement = document.getElementById('login-message');
  
  if (messageElement) {
    messageElement.style.color = 'blue';
    messageElement.innerText = "লগইন প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...";
  }

  try {
    // Google Apps Script-এ CORS সমস্যা এড়াতে text/plain পেলোড ব্যবহার করা হয়
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim()
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      console.log('User Details:', data.user);

      if (messageElement) {
        messageElement.style.color = 'green';
        messageElement.innerText = `স্বাগতম, ${data.user.name}!`;
      }

      // ব্রাউজারে ইউজার ডাটা সেভ রাখা (Session Management)
      localStorage.setItem('user', JSON.stringify(data.user));

      // সফল লগইনের পর অন্য পেজে রিডাইরেক্ট করতে চাইলে নিচের লাইনটির কমেন্ট তুলে দিন:
      // window.location.href = 'dashboard.html';

    } else {
      if (messageElement) {
        messageElement.style.color = 'red';
        messageElement.innerText = data.message;
      }
    }

  } catch (error) {
    console.error('Error during login:', error);
    if (messageElement) {
      messageElement.style.color = 'red';
      messageElement.innerText = "সার্ভারে কানেক্ট করতে সমস্যা হচ্ছে! আবার চেষ্টা করুন।";
    }
  }
}

// Form Submit Event Listeners (যদি আপনার HTML-এ form থাকে)
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username').value;
      const passwordInput = document.getElementById('password').value;

      handleLogin(usernameInput, passwordInput);
    });
  }
});
