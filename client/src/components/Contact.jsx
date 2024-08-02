import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");


  const handleChange = (e) => {
    setMessage(e.target.value);
  }
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        if (listing.userRef) {
          const res = await fetch(`/api/user/${listing.userRef}`);
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
          } else {
            setLandlord(data);
          }
        } else {
          console.error("listing.userRef is undefined");
        }
      } catch (error) {
        console.error("Failed to fetch landlord:", error);
      }
    };

    fetchLandlord();
  // eslint-disable-next-line react/prop-types
  }, [listing.userRef]);

  if (!landlord) {
    return <p>Loading landlord information...</p>;
  }

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={handleChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}

export default Contact;
