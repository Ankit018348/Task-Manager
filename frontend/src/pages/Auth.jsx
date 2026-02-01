import { useState } from "react";
import { API } from "../api";

export default function Auth() {
  const [login, setLogin] = useState(true);

  const submit = async (e) => {
    e.preventDefault();

    if (login) {
      const res = await API.post("/auth/login", {
        email: e.target.email.value,
        password: e.target.password.value,
      });
      localStorage.setItem("token", res.data.token);
      window.location = "/tasks";
    } else {
      await API.post("/auth/register", {
        name: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });
      setLogin(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h2 className="text-3xl font-bold mb-2">
          {login ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-500 mb-6">
          {login
            ? "Sign in to your task manager account"
            : "Join us and start managing your tasks"}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            className="w-full p-2 border rounded"
            required
          />

          {!login && (
            <>
              <label className="block text-sm font-medium">Username</label>
              <input
                name="username"
                placeholder="Choose a username"
                className="w-full p-2 border rounded"
                required
              />
            </>
          )}

          <label className="block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            className="w-full p-2 border rounded"
            required
          />

          <button className="w-full bg-black text-white py-2 rounded-lg mt-4">
            {login ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          {login ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setLogin(!login)}
            className="ml-1 font-semibold"
          >
            {login ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
