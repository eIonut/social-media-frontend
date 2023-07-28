const localStorageKey = "token";
const authURL = `${import.meta.env.VITE_REACT_APP_API_URL}/auth`;

function getToken() {
  if (!window.localStorage.getItem(localStorageKey)) {
    return;
  }
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse(token) {
  window.localStorage.setItem(localStorageKey, token);
  return token;
}

function login({ email, password }) {
  return client("/login", { email, password }).then((res) =>
    handleUserResponse(res.token)
  );
}

function register({ name, email, password }) {
  return client("/register", {
    name,
    email,
    password,
  }).then((data) => console.log(data));
}

async function logout() {
  window.localStorage.removeItem(localStorageKey);
  window.location.assign("/login");
}

async function client(endpoint, data) {
  const config = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  return window
    .fetch(`${authURL}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await logout();
        window.location.assign(window.location);
        return Promise.reject({ message: "Please re-authenticate." });
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

export { getToken, login, register, logout, localStorageKey };
