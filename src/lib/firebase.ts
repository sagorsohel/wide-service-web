import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
  Auth,
} from "firebase/auth";

export interface WideUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  createdAt?: string;
  role?: string;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForWideServiceApp2026",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "wide-service.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wide-service",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "wide-service.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "112041826907",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:112041826907:web:89a1bc2d3e4f",
};

// Initialize Firebase safely (avoiding multiple initializations in Next.js SSR / HMR)
let app: FirebaseApp;
let auth: Auth | null = null;
const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "AIzaSyDummyKeyForWideServiceApp2026"
);

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} catch (err) {
  console.warn("Firebase initialization warning:", err);
}

const LOCAL_USER_KEY = "wide_service_current_user";

/**
 * Get locally stored user session (useful for offline/instant resume)
 */
export function getSavedLocalUser(): WideUserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save user profile to local storage
 */
export function saveLocalUser(user: WideUserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  } catch {}
}

/**
 * Sign In with Email & Password via Firebase Auth
 */
export async function loginWithEmail(email: string, pass: string): Promise<WideUserProfile> {
  if (auth && isConfigured) {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const profile: WideUserProfile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName || email.split("@")[0],
      phoneNumber: cred.user.phoneNumber,
      photoURL: cred.user.photoURL,
      createdAt: cred.user.metadata.creationTime,
    };
    saveLocalUser(profile);
    return profile;
  }

  // Graceful fallback for local development if Firebase keys aren't yet populated in .env
  const mockUser: WideUserProfile = {
    uid: "user_" + Math.random().toString(36).substring(2, 9),
    email: email.trim(),
    displayName: email.split("@")[0].replace(/[._]/g, " "),
    phoneNumber: "+880 1700-000000",
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    role: "Verified Customer",
  };
  saveLocalUser(mockUser);
  return mockUser;
}

/**
 * Sign Up with Name, Email & Password via Firebase Auth
 */
export async function registerWithEmail(
  name: string,
  email: string,
  pass: string,
  phone?: string
): Promise<WideUserProfile> {
  if (auth && isConfigured) {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name.trim()) {
      await updateProfile(cred.user, {
        displayName: name.trim(),
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      });
    }
    const profile: WideUserProfile = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: name.trim() || email.split("@")[0],
      phoneNumber: phone || null,
      photoURL: cred.user.photoURL,
      createdAt: cred.user.metadata.creationTime,
    };
    saveLocalUser(profile);
    return profile;
  }

  // Fallback for local testing
  const mockUser: WideUserProfile = {
    uid: "user_" + Math.random().toString(36).substring(2, 9),
    email: email.trim(),
    displayName: name.trim() || email.split("@")[0],
    phoneNumber: phone || "+880 1700-123456",
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
    createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    role: "Verified Customer",
  };
  saveLocalUser(mockUser);
  return mockUser;
}

/**
 * Sign Out from Firebase and clear storage
 */
export async function logoutUser(): Promise<void> {
  if (auth && isConfigured) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
  }
  saveLocalUser(null);
}

/**
 * Subscribe to Auth State changes
 */
export function subscribeToAuth(callback: (user: WideUserProfile | null) => void): () => void {
  // First emit saved local user
  const initial = getSavedLocalUser();
  if (initial) callback(initial);

  if (!auth || !isConfigured) {
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      const profile: WideUserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        phoneNumber: firebaseUser.phoneNumber,
        photoURL: firebaseUser.photoURL,
        createdAt: firebaseUser.metadata.creationTime,
      };
      saveLocalUser(profile);
      callback(profile);
    } else {
      saveLocalUser(null);
      callback(null);
    }
  });
}

export { auth };
