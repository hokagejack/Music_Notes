import Link from "next/link";  // importing link feature from next.js
import { auth } from "../utils/firebase";  // firebase authentication instance
import { useAuthState } from "react-firebase-hooks/auth";  // hook manages auth state

export default function Nav() {
  // firebase hook retrieves user / loading state
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
    /* link to the homepage */
      <Link href="/"> 
        <button className="px-10 text-lg font-medium active:text-gray-500 hover:text-gray-400"> Music Notes: Home </button>
      </Link>

      {/* Conditional rendering based on user authentication status */}
      <ul className="flex items-center gap-10">
        {!user && (
          // If the user is not logged in, show a "Join Now" button linking to the login page
          <Link href={"/auth/login"} legacyBehavior> 
            <a className="py-2 px-4 text-sm bg-green-600 text-white rounded-lg hover:bg-green-400 font-medium active:bg-green-200">
              Join Now
            </a>
          </Link>
        )}
        {user && (
          // If the user is logged in, show buttons to post and a profile image linking to the dashboard
          <div className="flex items-center gap-6 px-10">
            {/* Link to the post creation page */}
            <Link href="/post" >
              <button className="font-medium bg-green-600 active:bg-green-200 hover:bg-green-400 text-white py-2 px-2 rounded-mg textx-sm">
                Post Here
              </button>
            </Link>

            {/* Profile picture that links to the user's dashboard */}
            <Link href="/dashboard" >
              <img 
                src={user.photoURL}  // Display the user's profile picture from Firebase auth
                className="w-12 rounded-full cursor-pointer hover:opacity-90 active:opacity-60"
              />
            </Link>
          </div>
        )}
      </ul> 
    </nav>
  );
}
