import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", user.user.uid), {
        createdAt: Date.now()
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Create Account</h1>

      <form onSubmit={registerUser} className="w-full max-w-sm space-y-4">
        <input type="email" className="p-3 border rounded w-full" placeholder="Email"
          onChange={e => setEmail(e.target.value)} />

        <input type="password" className="p-3 border rounded w-full" placeholder="Password"
          onChange={e => setPassword(e.target.value)} />

        <button className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700">
          Register
        </button>
      </form>

      <p className="mt-3 text-sm">
        Already have an account?
        <Link to="/login" className="text-indigo-600 font-semibold"> Login</Link>
      </p>
    </div>
  );
}
