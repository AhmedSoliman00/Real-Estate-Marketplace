import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        </div>
      )}
    </main>
  );
}

export default Listing;
