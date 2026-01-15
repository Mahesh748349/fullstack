async function registerUser(e) {
  e.preventDefault();

  const role = document.getElementById("role").value;

  let payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role,
  };

  if (role === "tenant") {
    payload.tenantDetails = {
      aadhaarNumber: document.getElementById("aadhaar").value,
      contact: {
        primaryMobile: document.getElementById("mobile").value,
      },
      permanentAddress: {
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
      },
      occupation: {
        type: document.getElementById("occupation").value,
        companyOrCollege: document.getElementById("company").value,
      },
      income: {
        monthlyIncome: Number(document.getElementById("income").value),
      },
    };
  }

  if (role === "owner") {
    payload.ownerDetails = {
      aadhaarNumber: document.getElementById("ownerAadhaar").value,
      contact: {
        mobile: document.getElementById("ownerMobile").value,
      },
      address: {
        city: document.getElementById("ownerCity").value,
        state: document.getElementById("ownerState").value,
      },
      bankDetails: {
        accountNumber: document.getElementById("account").value,
        ifsc: document.getElementById("ifsc").value,
      },
    };
  }

  const res = await apiRequest("/auth/register", "POST", payload);

  alert(res.message || "Registered successfully");
  window.location.href = "login.html";
}

async function loginUser(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiRequest("/auth/login", "POST", { email, password });

  if (res.token) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("role", res.role);
    localStorage.setItem("name", res.name);

    if (res.role === "owner") {
      window.location.href = "../owner/dashboard.html";
    } else {
      window.location.href = "../tenant/dashboard.html";
    }
  } else {
    alert(res.message || "Login failed");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}
