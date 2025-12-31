function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(url, method = "GET", data = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = token;

  const res = await fetch(API_BASE + url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  return res.json();
}
