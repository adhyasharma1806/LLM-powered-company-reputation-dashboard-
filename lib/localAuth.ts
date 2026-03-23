'use client';

type User = {
  email: string;
  password: string;
};

const USERS_KEY = 'repintel-users';
const CURRENT_USER_KEY = 'repintel-current-user';

function getWindow(): Window | null {
  if (typeof window === 'undefined') return null;
  return window;
}

function loadUsers(): User[] {
  const win = getWindow();
  if (!win) return [];

  const raw = win.localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as User[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  const win = getWindow();
  if (!win) return;
  win.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const win = getWindow();
  if (!win) return null;
  const raw = win.localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function setCurrentUser(user: User | null) {
  const win = getWindow();
  if (!win) return;
  if (!user) {
    win.localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    win.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export async function signUpLocal(email: string, password: string) {
  const users = loadUsers();
  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    return { ok: false, error: 'User already exists. Please sign in instead.' };
  }

  const newUser: User = { email, password };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);

  return { ok: true };
}

export async function signInLocal(email: string, password: string) {
  const users = loadUsers();
  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!existing || existing.password !== password) {
    return { ok: false, error: 'Invalid email or password.' };
  }

  setCurrentUser(existing);
  return { ok: true };
}

export function signOutLocal() {
  setCurrentUser(null);
}

