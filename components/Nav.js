import Link from "next/link"; // import Link component for nav
import { auth } from "../utils/firebase"; //  for authentication
import { useAuthState } from "react-firebase-hooks/auth"; //  hook managing auth state

export default function Nav() {
  const [user, loading] = useAuthState(auth); // get user and loading state from auth

  return (
    <nav className="flex justify-between items-center py-10"> {/* main navigation container */}
      <Link href="/"> 
        <button className="px-10 text-lg font-medium active:text-gray-500 hover:text-gray-400"> Music Notes: Home </button> {/* home button */}
      </Link>
      <ul className="flex items-center gap-10"> {/* list for navigation items */}
        {!user && ( // condition to check if user not logged in
        <Link href={"/auth/login"} legacyBehavior> 
          <a className="py-2 px-4 text-sm bg-green-600 text-white rounded-lg hover:bg-green-400 font-medium active:bg-green-200">Join Now</a> {/* join button for new users */}
        </Link>
        )}
        {user && ( // condition to check if user is logged in
          <div className="flex items-center gap-6 px-10"> {/* container for user actions */}
            <Link href="/post" >
            <button className="font-medium bg-green-600 active:bg-green-200 hover:bg-green-400 text-white py-2 px-2 rounded-mg textx-sm">Post Here</button> {/* button to post content */}
            </Link>
            <Link href="/dashboard" >
            <img src={user.photoURL} className="w-12 rounded-full curser-pointer hover:opacity-90 active:opacity-60"/> {/* user's profile picture with hover effects */}
            </Link>
          </div>
        )}
      </ul> 
    </nav>
  );
}
