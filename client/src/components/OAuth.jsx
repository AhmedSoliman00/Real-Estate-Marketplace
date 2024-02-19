import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { errorHandler } from "./../../../api/utils/error";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleGoogleAuth() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider); // Added await here
      console.log(result);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    //type="button" to prevent the form from submitting
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="bg-red-500 text-white p-3 rounded-lg uppercase font-bold hover:duration-500 hover:bg-red-600 transition-colors"
    >
      Continue With Google
    </button>
  );
}

export default OAuth;
