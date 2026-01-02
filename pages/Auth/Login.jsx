import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Welcome Back</h1>

      <form onSubmit={loginUser} className="w-full max-w-sm space-y-4">
        <input type="email" className="p-3 border rounded w-full" placeholder="Email"
          onChange={e => setEmail(e.target.value)} />

        <input type="password" className="p-3 border rounded w-full" placeholder="Password"
          onChange={e => setPassword(e.target.value)} />

        <button className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700">
          Login
        </button>
      </form>

      <p className="mt-3 text-sm">
        New here?
        <Link to="/register" className="text-indigo-600 font-semibold"> Create Account</Link>
      </p>
    </div>
  );
}
