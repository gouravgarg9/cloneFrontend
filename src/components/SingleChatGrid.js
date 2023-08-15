let BASE= process.env.REACT_APP_BACK_END_ROOT
const getLocalTime = (chat,userId,role) => {
    let msg = chat.latestMessage; 
    if (!msg) return;
    console.log(msg);
    const msgdate = new Date(Date.parse(msg.createdAt));
    const seendate = new Date(Date.parse(chat[`lastSeenBy${role}`]))
    const day = `${msgdate.getDate()}/${msgdate.getMonth() + 1}/${msgdate.getFullYear()}`;
    const time = `${msgdate.getHours()}:${msgdate.getMinutes()}`;
    let notify = "";
    if( (msg.senderId != userId) && (seendate.getTime() < msgdate.getTime()) )notify = "🔔";
    return (
      <span>
        {notify}
        <div>
            <div>{time}</div>
            <div>{day}</div>
        </div>
      </span>
    );
  };

const SingleChatGrid = (props) => {
    let chat = props.chat;
    let role = props.role;
    let userId = props.userId;
  return (
    <li className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition">
      <div className="flex ml-2">
        {" "}
        <img
          alt=""
          src={`https://${BASE}/images/users/${chat[`${role}Id`]?.photo || "xyz.png"}`}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex flex-col ml-2">
          {" "}
          <span className="font-medium text-black">
            {chat[`${role}Id`]?.username || "User"}
          </span>{" "}
          <span className="text-sm text-gray-400 truncate w-32">
            {chat.latestMessage?.content}
          </span>{" "}
        </div>
      </div>
      <div className="flex flex-col items-center">
        {" "}
        <span className="text-gray-300">
          {getLocalTime(chat,userId,(role=="seller")?'Seller':'Buyer')}
        </span>{" "}
        <i className="fa fa-star text-green-400" />{" "}
      </div>
    </li>
  );
};

export default SingleChatGrid;
