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
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
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

  const handleShowListings = () => {
    console.log("show listings");
    try {
      setShowListingsError(false);
      fetch(`/api/user/listings/${currentUser._id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success === false) {
            setShowListingsError(true);
            return;
          }
          setUserListings(data);
          console.log(userListings);
        });
    } catch (err) {
      {
        setShowListingsError(true);
      }
    }
  };

  const handleListingDelete = async (id) => {
    try {
      const res = await fetch(`/api/user/listings/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings(userListings.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error);
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
          setFormData({ ...formData, avatar: downloadURL }),
        );
      },
    );
  };
  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          className="mb-3 flex h-24 w-24 cursor-pointer self-center rounded-full object-cover"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="self-center text-sm">
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
          className="rounded-lg border border-gray-300 p-3 outline-1 focus:outline-orange-200"
          type="text"
          defaultValue={currentUser.username}
          onChange={handleChange}
          placeholder="username"
          id="username"
        />
        <input
          className="rounded-lg border border-gray-300 p-3 focus:outline-orange-200"
          type="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          placeholder="email"
          id="email"
        />
        <input
          className="rounded-lg border border-gray-300 p-3 focus:outline-orange-200"
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-orange-400 p-3 font-bold uppercase text-white transition-colors hover:bg-orange-600 hover:duration-500"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="rounded-lg bg-green-600 p-3 text-center font-bold uppercase text-white transition-colors hover:bg-green-800 hover:duration-500"
        >
          Create Listing
        </Link>
        {error ? <p className="text-center text-red-500">{error}</p> : " "}
        {updatedSuccess && (
          <p className="text-center text-green-500">Updated Successfully</p>
        )}
      </form>
      <div className="font mt-3 flex justify-between">
        <span onClick={handleSignOut} className="cursor-pointer text-blue-700">
          Sign out
        </span>
        <button className="text-green-600" onClick={handleShowListings}>
          Show Listings
        </button>
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer text-red-700"
        >
          Delete Acc
        </span>
        {showListingsError && (
          <p className="text-red-500">Error showing listings</p>
        )}
      </div>
      <div>
        {userListings.length > 0 ? (
          <>
            <h1 className="my-4 text-center text-lg uppercase">
              your listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="m-3 flex items-center justify-between rounded-lg border p-3"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    className="h-20 w-20 rounded-md object-cover"
                    src={listing.imageUrls[0]}
                    alt="listing"
                  />
                </Link>
                <Link
                  className="flex-0.25 truncate text-sm font-bold text-slate-700"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="flex flex-col gap-1">
                  <button
                    className="small-btn p-1"
                    onClick={() => handleListingDelete(listing._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="small-btn text-green-700 hover:bg-green-700">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="my-5 text-center text-lg">you dont have any listings</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
