import { FcGoogle } from "react-icons/fc"; // google icon
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; //firebase auth functions
import { auth } from "../../utils/firebase"; 
import { useRouter } from "next/router"; // router for navigation
import { useAuthState } from "react-firebase-hooks/auth"; //hook for auth state
import { useEffect } from "react"; //effect hook for side effects

export default function Login() {
  const route = useRouter(); //initialize router
  const [user, loading] = useAuthState(auth); //get current user and loading state
  //sign in with google
  const googleProvider = new GoogleAuthProvider(); //create google provider
  const GoogleLogin = async () => { //function for google login
    try {
      const result = await signInWithPopup(auth, googleProvider); //try signing in
      route.push("/"); //redirect to home after login
    } catch (error) {
      console.log(error); //log errors
    }
  };
  
  useEffect(() => { //effect to handle user state changes
    if (user) {
      route.push("/"); //redirect to home if user logged in
    } else {
      console.log("login"); //log message if no user
    }
  }, [user]); //run effect when user state changes

  return (
    <div className="shadow-xl mt-32 p-10 text-grey-700 rounded-lg"> 
      <h2 className="text-2xl font-medium">Join Today</h2> //heading for login prompt
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3> //heading for sign-in options
        <button onClick={GoogleLogin} //button for google login
                className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"> 
          <FcGoogle className="text-2xl"/> //google icon
          Sign in with Google 
        </button>
        
      </div>
    </div>

  )
}
