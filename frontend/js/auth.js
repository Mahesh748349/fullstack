async function registerUser(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  let tenantDetails = null;

  // 👇 ONLY if tenant, collect extra details
  if (role === "tenant") {
    tenantDetails = {
      aadhaarNumber: document.getElementById("aadhaar")?.value,
      permanentAddress: {
        city: document.getElementById("city")?.value,
      },
      contact: {
        primaryMobile: document.getElementById("mobile")?.value,
      },
      occupation: {
        type: document.getElementById("occupation")?.value,
        companyOrCollege: document.getElementById("company")?.value,
      },
      income: {
        monthlyIncome: Number(document.getElementById("income")?.value),
      },
    };
  }

  const res = await apiRequest("/auth/register", "POST", {
    name,
    email,
    password,
    role,
    tenantDetails,
  });

  alert(res.message || "Registered");

  if (!res.message?.includes("exists")) {
    window.location.href = "login.html";
  }
}

async function loginUser(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiRequest("/auth/login", "POST", {
    email,
    password,
  });

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
