{ auth, db } from "../utils/firebase"; 
{ useAuthState } from "react-firebase-hooks/auth"; 
{ Router, useRouter } from "next/router"; 
{ useEffect, useState } from "react"; //hooks for state and effects
{ addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"; // for adding, updating documents
{ toast } from "react-toastify"; //toast notifications for alerts

export default function Post() {
  //form state
  const [post, setPost] = useState({ description: "" }); 
  const [user, loading] = useAuthState(auth); 
  const route = useRouter(); 
  const routeData = route.query; //get query data from route

  //submit post function
  const submitPost = async (e) => {
    e.preventDefault(); //prevent default form submission
    //run some checks
    if (!post.description) { 
      toast.error("Description Field empty", {
        autoClose: 1000,
      });
      return; //if empty
    }
    if (post.description.length > 300) { 
      toast.error("Description too long", {
        autoClose: 1000,
      });
      return; // if too long
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, 'posts', post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() }; 
      await updateDoc(docRef, updatedPost); //update post in firestore
      return route.push('/'); //redirect to home after update

    } else {
      //make a new post
      const collectionRef = collection(db, "posts"); 
      await addDoc(collectionRef, { //add new doc to collection
        ...post,
        timestamp: serverTimestamp(), 
        user: user.uid, 
        avatar: user.photoURL, 
        username: user.displayName, 
      });
      setPost({ description: "" }); //reset post state after submission
      toast.success('Post has been made', {
        autoClose: 1500 }); 
      return route.push('/'); //redirect to home after post
    }
  };

  //check user function
  const checkUser = async () => {
    if (loading) return; //wait if loading
    if (!user) route.push("/auth/login"); 
    if (routeData.id) { 
      setPost({ description: routeData.description, id: routeData.id }); //set post for editing
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]); //dependencies for effect

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-med mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit your post" : "Create new Post"} 
        </h1>
        <div className="py-2">
          <h3 className="text-lg py-2 font-medium">Description</h3>
          <textarea 
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })} //update post description
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p className={`text-green-500 font-medium text-sm ${post.description.length > 300 ? `text-red-600` : ""}`}>
            {post.description.length}/300 {/* display character count */}
          </p>
        </div>
        <button 
          type="submit"
          className="v-full bg-green-600 hover:bg-green-500 active:bg-green-200 text-white font-medium my-2 p-2 rounded-lg text-sm">
          Submit 
        </button>
      </form>
    </div>
  );
}
