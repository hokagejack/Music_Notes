import Link from "next/link";
import {auth} from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/"> 
        <button className="px-10 text-lg font-medium active:text-gray-500 hover:text-gray-400"> Music Notes: Home </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
        <Link href={"/auth/login"} legacyBehavior> 
          <a className="py-2 px-4 text-sm bg-green-600 text-white rounded-lg hover:bg-green-400 font-medium active:bg-green-200">Join Now</a>
        </Link>
        )}
        {user && (
          <div className="flex items-center gap-6 px-10">
            <Link href="/post" >
            <button className="font-medium bg-green-600 active:bg-green-200 hover:bg-green-400 text-white py-2 px-2 rounded-mg textx-sm">Post Here</button>
            </Link>
            <Link href="/dashboard" >
            <img src={user.photoURL} className="w-12 rounded-full curser-pointer hover:opacity-90 active:opacity-60"/>
            </Link>
          </div>
        )}
      </ul> 
    </nav>
  );
}
