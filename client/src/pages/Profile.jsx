import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./../firebase";

//  firebase storage
//   allow read;
//   allow write: if
//   request.resource.size < 2 * 1024 * 1024 &&
//   request.resource.contentType.matches('image/.*')

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileref = useRef(null);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(filePerc);
  console.log(fileUploadError);
  console.log(formData);
  console.log(filePerc);

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
      <form className="gap-4 flex flex-col">
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
