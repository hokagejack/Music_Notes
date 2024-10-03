import Message from "../components/message"; //message component
import { useRouter } from "next/router"; //router for navigation
import { useEffect, useState } from "react"; //hooks for state and effects
import { auth, db } from "../utils/firebase"; //firebase auth and database
import { doc, updateDoc, arrayUnion, onSnapshot, Timestamp } from "firebase/firestore"; //firestore functions
import { toast } from "react-toastify"; //toast for notifications

export default function Details() {
  const router = useRouter(); //initialize router
  const routeData = router.query; //get route data
  const [message, setMessage] = useState(""); //state for input message
  const [allMessage, setAllMessages] = useState([]); //state for all messages

  //submit a message
  const submitMessage = async () => {
    //check if user logged in
    if (!auth.currentUser) return router.push('auth.login'); //redirect if not logged in

    if (!message) { //check if message empty
      toast.error("Message empty", {
        autoClose: 1000, //set duration for toast
      });
      return; //stop execution if empty
    }
    const docRef = doc(db, 'posts', routeData.id); 
    await updateDoc(docRef, { //update with new comment
      comments: arrayUnion({ //add new comment to comments array
        message, 
        avatar: auth.currentUser.photoURL, 
        userName: auth.currentUser.displayName, 
        time: Timestamp.now(), 
      }),
    });

    setMessage(""); //reset message input
  };

  //get comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => { //listen for snapshot updates
      setAllMessages(snapshot.data().comments); //set messages from snapshot
    });
    return unsubscribe; //for cleanup
  };

  useEffect(() => {
    if (!router.isReady) return; //wait until router is ready
    getComments(); //get comments once ready
  }, [router.isReady]); 

  return (
    <div>
      <Message {...routeData}></Message> {/* render message component */}
      <div className="my-4">
        <div className="flex">
          <input onChange={(e) => setMessage(e.target.value)} //update message state on change
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
          {allMessage?.map((message) => ( //map through all messages
            <div className="bg-white p-4 my-4 border-2" key={message.time}> {/* message container */}
              <div className="flex items-center gap-2 mb-4">
                <img 
                className="w-10 rounded-full"
                src={message.avatar} //user avatar
                alt="" 
                />
                <h2>{message.userName}</h2> {/* display user name */}
              </div>
              <h2>{message.message}</h2> {/* display message content */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
