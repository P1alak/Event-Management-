document.addEventListener("DOMContentLoaded", function () {
  
  document.getElementById("signupForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  });

  
  document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedEmail", email);
      localStorage.setItem("loggedUsername", user.username); // Save username
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });

  
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      console.log("Logging out...");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("loggedEmail");
      localStorage.removeItem("loggedUsername");
      window.location.replace("index.html");
    });
  }

 
if (window.location.pathname.includes("dashboard.html")) {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
  } else {
    const username = localStorage.getItem("loggedUsername");
    const userEmailElement = document.getElementById("userEmail");
    if (userEmailElement) {
      userEmailElement.textContent = `Welcome, ${username || "User"}`;
    }
  }
}

});
