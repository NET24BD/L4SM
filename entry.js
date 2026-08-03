const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzNw_d6tW3L3cFHtusSqUujnFSKC4gRYvIplxcNy2h9pUAO8AU1-K2XcBzeRNNelVtXog/exec";

document.addEventListener("DOMContentLoaded", () => {
    const referenceInput = document.getElementById("reference");
    const loggedUser = localStorage.getItem("username");

    if (loggedUser) {
        referenceInput.value = loggedUser;
    } else {
        window.location.href = "index.html"; 
    }
});

document.getElementById("entryForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const reference = document.getElementById("reference").value;
    const customerId = document.getElementById("customerId").value.trim();
    const problem = document.getElementById("problem").value.trim();
    const message = document.getElementById("message");
    const btn = document.getElementById("submitBtn");

    if (!customerId || !problem) {
        message.innerHTML = "Please fill in all required fields.";
        message.style.color = "#dc2626";
        return;
    }

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "addEntry",
                reference: reference,
                customerId: customerId,
                problem: problem
            })
        });

        const data = await response.json();

        if (data.success) {
            message.innerHTML = "Entry Created Successfully!";
            message.style.color = "#16a34a";
            
            // Clear inputs except Reference
            document.getElementById("customerId").value = "";
            document.getElementById("problem").value = "";
        } else {
            message.innerHTML = data.message || "Failed to submit entry.";
            message.style.color = "#dc2626";
        }

    } catch (error) {
        console.error("Error:", error);
        message.innerHTML = "Server Connection Failed!";
        message.style.color = "#dc2626";
    } finally {
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SUBMIT ENTRY';
        btn.disabled = false;
    }
});
