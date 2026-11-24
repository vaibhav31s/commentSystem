// Login session helpers. The backend identifies the user only from the signed
// token, so every request that changes data must go through authFetch().

const SESSION_KEYS = ["token", "email", "Name", "authorId", "avatar"];

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode etc.); the session just won't persist
  }
}

export function getToken() {
  return safeGet("token");
}

/** Store the user returned by /login (or /register). */
export function saveSession(user, email) {
  safeSet("login", true);
  safeSet("token", user.token ?? "");
  safeSet("email", user.Email ?? email ?? "");
  safeSet("Name", user.Name ?? "");
  safeSet("authorId", user.Id ?? "");
  safeSet("avatar", user.avatar ?? "");
}

export function clearSession() {
  safeSet("login", false);
  for (const key of SESSION_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

/**
 * fetch() that sends the login token. If the server says the session is
 * missing/expired (401), the user is logged out and sent to the login page.
 */
export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    clearSession();
    if (window.location.pathname !== "/login") window.location.href = "/login";
  }
  return response;
}
