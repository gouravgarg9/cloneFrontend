import React, { useEffect, useState } from "react";
import { useLocation, useNavigate,Link } from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation";
let BASE=process.env.REACT_APP_BACK_END_ROOT

axios.defaults.withCredentials=true
const ChatList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let product = location.state.data;
  let user = location.state.user;
  //if(!product)navigate('/');

  const [chats, setChats] = useState([]);
  const loadChat = async () => {
    try {
      const res = await axios.get(
        `https://${BASE}/api/chats/getChatByProductId/` + product._id
      );
      setChats(res.data.data.chat);
    } catch (e) {
      console.log(e);
      navigate('/');
    }
  };
  useEffect(() => {
    loadChat();
    const timeOut = setTimeout(() => {
      navigate('/show-product',{state: {user,data:product}});
    }, 40000);

    return ()=>{
      clearTimeout(timeOut);
    }
  }, []);
  const getLocalTime = (date)=>{
    if(!date)return;
    const newDate = new Date(Date.parse(date));
    const day = `${newDate.getDate()}/${newDate.getMonth()+1}/${newDate.getFullYear()}`
    const time = `${newDate.getHours()}:${newDate.getMinutes()}`;
    return (<><div>{time}</div>
        <div>{day}</div></>);
  }
  return (
    <>
    <Navigation user={user}/>
      <div className="py-10 h-screen bg-gray-300 px-2">
        <div className="max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden md:max-w-lg">
          <div className="md:flex">
            <div className="w-full p-4">
              <div className="relative">
                {" "}
                <input
                  type="text"
                  className="w-full h-12 rounded focus:outline-none px-3 focus:shadow-md"
                  placeholder="Search..."
                />{" "}
                <i className="fa fa-search absolute right-3 top-4 text-gray-300" />{" "}
              </div>
              <ul>
                {chats?.reverse().map((chat) => (
                  <Link key={chat._id}
                    to="/chat"
                    state={{
                      user,
                      chat
                    }}
                  >
                    <li
                      className="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition"
                    >
                      <div className="flex ml-2">
                        {" "}
                        <img
                          alt=""
                          src={`https://${BASE}/images/users/${chat.buyerId?.photo || 'xyz.png'}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex flex-col ml-2">
                          {" "}
                          <span className="font-medium text-black">
                            {chat.buyerId?.username || 'User'}
                          </span>{" "}
                          <span className="text-sm text-gray-400 truncate w-32">
                            {chat.latestMessage?.content}
                          </span>{" "}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        {" "}
                        <span className="text-gray-300">{getLocalTime(chat.latestMessage?.createdAt)}</span>{" "}
                        <i className="fa fa-star text-green-400" />{" "}
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
