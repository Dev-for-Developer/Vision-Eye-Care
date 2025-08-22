import React from "react";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function AuthButton() {
  const { user, loading } = useAuth();

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <button className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300">…</button>;
  }

  return user ? (
    <div className="flex items-center gap-2">
      <img
        src={user.photoURL || "/vite.svg"}
        alt="avatar"
        className="w-7 h-7 rounded-full border border-neutral-600"
      />
      <span className="text-sm">{user.displayName || user.email}</span>
      <button onClick={logout} className="px-3 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800">
        Sign out
      </button>
    </div>
  ) : (
    <button onClick={login} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500">
      Sign in with Google
    </button>
  );
}
