import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="gap-4 flex flex-col">
        <img
          className="mb-3 flex object-cover rounded-full h-24 w-24 self-center"
          src={currentUser.avatar}
          alt="profile"
        />
        <input
          className="p-3 rounded-lg border border-gray-300 focus:outline-orange-200 outline-1"
          type="text"
          placeholder="username"
          id="username"
        />
        <input
          className="p-3 rounded-lg border border-gray-300 focus:outline-orange-200"
          type="email"
          placeholder="email"
          id="email"
        />
        <input
          className="p-3 rounded-lg border border-gray-300 focus:outline-orange-200"
          type="password"
          placeholder="password"
          id="password"
        />
        <button className="bg-orange-400 text-white p-3 rounded-lg uppercase font-bold hover:duration-500 hover:bg-orange-600 transition-colors">
          UPDATE
        </button>
      </form>
      <div className="font flex justify-between mt-3">
        <span className="text-blue-700 cursor-pointer">Sign out</span>
        <span className="text-red-700 cursor-pointer">Delete Account</span>
      </div>
    </div>
  );
}

export default Profile;
