import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const GoogleProvider = new GoogleAuthProvider();
      // Allow pop up when click sign in with google , even only single account sign in on your chrome
      GoogleProvider.setCustomParameters({ prompt: "select_account" });
      const Auth = getAuth(app);

      const resultGoogle = await signInWithPopup(Auth, GoogleProvider);

      const responseGoogle = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultGoogle.user.displayName,
          email: resultGoogle.user.email,
          photo: resultGoogle.user.photoURL,
        }),
      });
      const data = await responseGoogle.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Couldn't sign in with google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90"
    >
      Continue With Google
    </button>
  );
}
