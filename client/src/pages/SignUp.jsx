import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json(); // the data have the properties about the request i made. converted  to see it in the console
      console.log(data);

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      } else {
        setLoading(false);
        setError(null);
        navigate("/sign-in"); // to navigate to another component when finished successfully
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4 mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg focus:outline-red-300"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg focus:outline-red-300"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg focus:outline-red-300"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-orange-400 text-white p-3 rounded-lg uppercase font-bold hover:duration-500 hover:bg-orange-600 transition-colors "
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-600">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default SignUp;
