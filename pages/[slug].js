import Message from "../components/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {auth, db } from "../utils/firebase";
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Details(){
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessages] = useState([]);

  //submit a message
  const submitMessage = async() => {
    //check if user is logged
    if(!auth.currentUser) return router.push('auth.login');

    if(!message){
      toast.error("Message empty", {
        autoClose: 1000,
      });
      return;
    }
    const docRef = doc(db, 'posts', routeData.id);
    await updateDoc(docRef, {
        comments: arrayUnion({
        message, 
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  //get comments

  const getComments = async() => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if(!router.isReady) return;
    getComments();
  }, [router.isReady]);
  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input onChange={(e) => setMessage(e.target.value)} 
          type="text" 
          value={message} 
          placeholder="Send a message" 
          className="bg-gray-800 w-full p-2 text-white text-sm"
          />
          <button 
          onClick={submitMessage}
          className="bg-green-600 text-white py-2 px-4 text-sm hover:bg-green-400 active:bg-green-200"
          >Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allMessage?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.time}>
              <div className="flex items-center gap-2 mb-4">
                <img 
                className="w-10 rounded-full"
                src={message.avatar} 
                alt="" 
                />
                <h2>{message.userName}</h2>
              </div>
              <h2>{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}