import {Link} from "react-router-dom";
function SignUp() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4 mx-auto">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="eamil"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="username"
        />
        <button className="bg-orange-400 text-white p-3 rounded-lg uppercase font-bold hover:duration-500 hover:bg-orange-600 transition-colors">
          Sign up
        </button>
      </form>
      <div className="mt-5">
       <p>Have an account?</p>
       <Link to ={"/sign-in"}>
       <span className="text-blue-600">Sign in</span>
       </Link>
      </div>
    </div>
  );
}

export default SignUp;
