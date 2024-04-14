function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={70}
            minLength={10}
            required
          />
          <textarea
            className="border p-3 rounded-lg"
            placeholder="Description"
            name=""
            id="description"
            cols="10"
            rows="3"
          ></textarea>
          <input
            type="text"
            placeholder="Adress"
            className="border p-3 rounded-lg"
            id="adress"
            maxLength={70}
            minLength={10}
            required
          />
          <div className="flex gap-3 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span className="text-lg ">Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span className="text-lg ">Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking-spot" className="w-5" />
              <span className="text-lg ">Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span className="text-lg ">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="Offer" className="w-5" />
              <span className="text-lg ">Offer</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row  items-start gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
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
                className="p-3 border border-gray-300 rounded-lg"
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
                className="p-3 border border-gray-300 rounded-lg"
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
                className="p-3 border border-gray-300 rounded-lg"
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
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex">
            <p className="font-semibold">Images:  </p>
            <span className="font-normal text-gray-600">
               The first image will be the cover (max 6)
            </span>
          </div>
          <div>
            <input
              className="p-3 border border-gray-300 rounded w-60"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 ml-4 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
           
          </div>
          <div>
          <button className=" w-full text-center bg-blue-600 text-white p-3 rounded-lg uppercase font-bold hover:duration-500 hover:bg-blue-800 transition-colors">
              Share
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
