import { auth } from "../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import {useEffect, useState} from "react";
import { collection, query, where, onSnapshot, doc, deleteDoc} from "firebase/firestore";
import { db } from "../utils/firebase";
import Message from "../components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  //see if user is logged
  const getData = async () => {
    if(loading) return;
    if(!user) return route.push('/auth/login');
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot => {
      setPosts(snapshot.docs.map((doc) =>({...doc.data(), id: doc.id})))
    }))

    return unsubscribe;
  };
  //Delete a post
  const deletePost = async(id) => {
    const docRef = doc(db, 'posts', id)
    await deleteDoc(docRef);
  }


  //Get users Data
  useEffect(() => {
    getData();
  }, [user, loading]);
  return(
    <div>
      <h1>Your Posts</h1>
      <div>
        {posts.map(post =>{
        return (
        <Message {...post} key={post.id}>
          <div className="flex gap-4">
            <button 
              onClick={() => deletePost(post.id)}
              className="text-pink-600 active:text-pink-200 hover:text-pink-400 flex items-center justify-center gap-2 py-2 text-sm">
              <BsTrash2Fill className="text-2xl"/> Delete
            </button>
            <Link href={{pathname: "/post", query: post}}>
              <button className="text-green-400 active:text-green-100 hover:text-green-300 flex items-center justify-center gap-2 py-2 text-sm">
                <AiFillEdit className="text-2xl"/>Edit
              </button>
            </Link>
          </div>
        </Message>
        );
      })}

      </div>
      <button className="font-medium text-white bg-gray-800 hover:bg-gray-700 active:bg-gray-200 py-2 px-4 my-6" onClick ={() => auth.signOut() }>Sign Out</button>
    </div>
  );
}