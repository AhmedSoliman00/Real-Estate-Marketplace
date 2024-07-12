import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  console.log(formData);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length < 7) {
      setUploading(true); // set the uploading state to true for the button ui
      setImageUploadError(false); // reset the error state
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls), // add the new urls to the existing ones
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setImageUploadError("image upload failed 2mg for each image");
          
          
        });
    } else {
      setImageUploadError("Please select between 1 and 6 images");
      setUploading(false);

    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },

        // eslint-disable-next-line no-unused-vars
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            resolve(downloadURL),
          );
        },
      );
    });
  };
  const handleRemoveImage = (index) => {
    const newImages = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      imageUrls: newImages,
    });
  }
  console.log(files);
  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="rounded-lg border p-3"
            id="name"
            maxLength={70}
            minLength={10}
            required
          />
          <textarea
            className="rounded-lg border p-3"
            placeholder="Description"
            name=""
            id="description"
            cols="10"
            rows="3"
          ></textarea>
          <input
            type="text"
            placeholder="Adress"
            className="rounded-lg border p-3"
            id="adress"
            maxLength={70}
            minLength={10}
            required
          />
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span className="text-lg">Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span className="text-lg">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking-spot" className="w-5" />
              <span className="text-lg">Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span className="text-lg">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="Offer" className="w-5" />
              <span className="text-lg">Offer</span>
            </div>
          </div>
          <div className="flex flex-col flex-wrap items-start gap-2 sm:flex-row">
            <div className="flex items-center gap-2">
              <input
                className="rounded-lg border border-gray-300 p-3"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="rounded-lg border border-gray-300 p-3"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="rounded-lg border border-gray-300 p-3"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <p>Regular price</p>
              <span className="text-sm"> ($/month)</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="rounded-lg border border-gray-300 p-3"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <p>Discount Price</p>
              <span className="text-sm"> ($/month)</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex">
            <p className="font-semibold">Images: </p>
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6)
            </span>
          </div>
          <div>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="w-60 rounded border border-gray-300 p-3"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button" // change the type to prevent submitting the form
              disabled={uploading}
              onClick={handleImageSubmit}
              className="ml-4 rounded border border-green-700 p-3 uppercase text-green-700 hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && (
            <p className="text-lg font-bold text-red-500">{imageUploadError}</p>
          )}
          <div className="flex flex-wrap gap-5">
            {formData.imageUrls.map((url, index) => (
              <div className="flex flex-col" key={index}>
                <img
                  src={url}
                  alt="listing"
                  className="h-24 w-24 rounded-lg object-cover"
                />
                <button type="button" onClick={()=>handleRemoveImage(index)} className="p-0.1 my-2 rounded-lg border border-blue-950 font-bold text-red-500 transition duration-200 ease-in hover:bg-red-700 hover:text-white hover:opacity-80 hover:border-none hover:translate-y-1">
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button className="w-full rounded-lg bg-blue-600 p-3 text-center font-bold uppercase text-white transition-colors hover:bg-blue-800 hover:duration-500">
            Share
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
