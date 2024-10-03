import { auth } from "../utils/firebase";//
import { useRouter } from "next/router"; //router for navigation
import { useAuthState } from "react-firebase-hooks/auth"; //hook for auth state
import { useEffect, useState } from "react"; //hooks for state and effects
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore"; //firestore funcs
import { db } from "../utils/firebase"; //import database from firebase utils
import Message from "../components/message"; //import message component
import { BsTrash2Fill } from "react-icons/bs"; //trash / edit below
import { AiFillEdit } from "react-icons/ai"; //
import Link from "next/link"; //link for nav

export default function Dashboard() {
  const route = useRouter(); 
  const [user, loading] = useAuthState(auth); //get current user and loading state
  const [posts, setPosts] = useState([]); //state for user posts

  //see if user logged in
  const getData = async () => {
    if (loading) return; //wait if loading
    if (!user) return route.push('/auth/login'); //redirect if not logged in
    const collectionRef = collection(db, "posts"); //get posts collection reference
    const q = query(collectionRef, where("user", "==", user.uid)); //query for user's posts
    const unsubscribe = onSnapshot(q, (snapshot) => { //listen for snapshot updates
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); //set posts state
    });

    return unsubscribe; //cleanup
  };

  //delete a post -------
  const deletePost = async (id) => { 
    const docRef = doc(db, 'posts', id); //get document reference
    await deleteDoc(docRef); //delete document from firestore
  };

  // user data
  useEffect(() => { 
    getData(); 
  }, [user, loading]); //dependency array for effect

  return (
    <div>
      <h1>Your Posts</h1> {/* heading for user's posts */}
      <div>
        {posts.map(post => { //map through user posts
          return (
            <Message {...post} key={post.id}> {/* message component for each post */}
              <div className="flex gap-4"> {/* container for buttons */}
                <button 
                  onClick={() => deletePost(post.id)} 
                  className="text-pink-600 active:text-pink-200 hover:text-pink-400 flex items-center justify-center gap-2 py-2 text-sm">
                  <BsTrash2Fill className="text-2xl" /> Delete 
                </button>
                <Link href={{ pathname: "/post", query: post }}> {/* link to edit post */}
                  <button className="text-green-400 active:text-green-100 hover:text-green-300 flex items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit className="text-2xl" /> Edit 
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button className="font-medium text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-200 py-2 px-4 my-6" onClick={() => auth.signOut()}> {/* sign out button */}
        Sign Out
      </button>
    </div>
  );
}
