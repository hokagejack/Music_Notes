export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg px-10"> {/* main message container with padding and border */}
      <div className="flex items-center gap-2"> {/* flex container for avatar and username */}
        <img src={avatar} className="w-10 rounded-full" /> {/* user avatar, round shape for friendlyness */}
        <h2>{username}</h2> {/* display username */}
      </div>
      <div className="py-4"> {/* container for message description */}
        <p>{description}</p> {/* show the message content */}
      </div>
      {children} {/* render additional content passed as children */}
    </div>
  );
}

