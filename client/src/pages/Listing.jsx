import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import Contact from "../components/Contact";
import { Navigation } from "swiper/modules";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
  
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import "swiper/css/bundle";
import { useSelector } from "react-redux";


function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  console.log(currentUser._id);

  const params = useParams();
  const listingId = params.listingId;
  useEffect(() => {
    console.log("Listing ID:", listingId);
    const fetchListing = async () => {
      try {
        // Fetch data from the API
        const res = await fetch(`/api/listing/get-listing/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          // Optionally, handle the error state here as well
          setError(data.message);
        } else {
          setListing(data);
        }
      } catch (error) {
        console.error("Failed to fetch listing:", error);
        // Optionally, handle the error state here as well
      } finally {
        setLoading(false); // Ensure loading is set to false both after success and failure
      }
    };

    fetchListing();
  }, [listingId]); // Include listingId in the dependency array to refetch when it changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {loading && <p className="my-7 text-center text-2xl">Loading...</p>}
      {error && (
        <p className="my-7 text-center text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${url})` }}
                >
                  {/* Content goes here */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed right-[3%] top-[13%] z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-slate-100">
            <MdContentCopy
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed right-[5%] top-[23%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="mx-auto my-7 flex max-w-4xl flex-col gap-4 p-3">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-slate-600">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="w-full max-w-[200px] rounded-md bg-red-900 p-1 text-center text-white">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="w-full max-w-[200px] rounded-md bg-green-900 p-1 text-center text-white">
                  ${+listing.regularPrice - +listing.discountPrice}
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="flex flex-wrap items-center gap-4 text-sm font-semibold text-green-900 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="rounded-lg bg-slate-700 p-3 uppercase text-white hover:opacity-80"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}

export default Listing;
