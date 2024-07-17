import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      console.log(data.data);
      navigate(`/listing/${data.data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

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
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  console.log(files);
  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="rounded-lg border p-3"
            id="name"
            maxLength={70}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            className="rounded-lg border p-3"
            placeholder="Description"
            name=""
            id="description"
            cols="10"
            rows="3"
            onChange={handleChange}
            value={formData.description}
          ></textarea>
          <input
            type="text"
            placeholder="Adress"
            className="rounded-lg border p-3"
            id="address"
            maxLength={70}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span className="text-lg">Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span className="text-lg">Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span className="text-lg">Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span className="text-lg">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
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
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="rounded-lg border border-gray-300 p-3"
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="rounded-lg border border-gray-300 p-3"
                type="number"
                id="regularPrice"
                min={50}
                max={10000000}
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p>Regular price</p>
              <span className="text-sm">
                {" "}
                {formData.type === "rent" ? "($/month)" : ""}
              </span>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="rounded-lg border border-gray-300 p-3"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">
                    {formData.type === "rent" ? "($/month)" : ""}
                  </span>
                </div>
              </div>
            )}
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
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="small-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button
            disabled={loading || uploading}
            className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
