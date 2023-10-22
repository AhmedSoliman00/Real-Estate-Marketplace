import { FaSearch } from "react-icons/fa";
import { FaEarthAfrica } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
            <span className="text-slate-500">SIKO</span>
            <span className="text-slate-700">ESTATE</span>
            <FaEarthAfrica className="ml-1" />
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className="flex gap-4">
         <Link to="/">
          <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
            Home
          </li>
          </Link>
          <Link to="/about">
          <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
            About
          </li>
           </Link>
           <Link to="/sign-in">
          <li className=" text-slate-700 hover:underline cursor-pointer">
            Sign In
          </li>
            </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
