import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";

//  firebase storage
//   allow read;
//   allow write: if
//   request.resource.size < 2 * 1024 * 1024 &&
//   request.resource.contentType.matches('image/.*')

function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileref = useRef(null);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updatedSuccess, setUpdatedSuccess] = useState(false);
  console.log(filePerc);
  console.log(fileUploadError);
  console.log(formData);
  console.log(filePerc);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdatedSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          type="file"
          ref={fileref}
          accept="image/*"
        />
        {/* wrapper */}{" "}
        {/*group will make all the children hovers work when the parent hovered*/}
        <img
          onClick={() => fileref.current.click()}
          className="mb-3 flex object-cover cursor-pointer rounded-full h-24 w-24 self-center "
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="p-3 rounded-lg border border-gray-300 focus:outline-orange-200 outline-1"
          type="text"
          defaultValue={currentUser.username}
          onChange={handleChange}
          placeholder="username"
          id="username"
        />
        <input
          className="p-3 rounded-lg border border-gray-300 focus:outline-orange-200"
          type="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          placeholder="email"
          id="email"
        />
        <input
          className="p-3 rounded-lg border border-gray-300 focus:outline-orange-200"
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          className="bg-orange-400 text-white p-3 rounded-lg uppercase font-bold hover:duration-500 hover:bg-orange-600 transition-colors"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className=" text-center bg-green-600 text-white p-3 rounded-lg uppercase font-bold hover:duration-500 hover:bg-green-800 transition-colors"
        >
          Create Listing
        </Link>
        {error ? <p className="text-red-500 text-center">{error}</p> : " "}
        {updatedSuccess && (
          <p className=" text-green-500 text-center">Updated Successfully</p>
        )}
      </form>
      <div className="font flex justify-between mt-3">
        <span onClick={handleSignOut} className="text-blue-700 cursor-pointer">
          Sign out
        </span>
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
      </div>
    </div>
  );
}

export default Profile;
