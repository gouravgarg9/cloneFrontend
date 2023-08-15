import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { socket } from "./../socket";
import Navigation from "../components/Navigation";
import SingleChatGrid from "../components/SingleChatGrid";
let BASE=process.env.REACT_APP_BACK_END_ROOT

axios.defaults.withCredentials = true;
const AllChatList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let user = location.state.user;
  //if(!user)navigate('/');
  const [buyingChats, setBuyingChats] = useState([]);
  const [sellingChats, setSellingChats] = useState([]);

  const loadChat = async () => {
    try {
      const res = await axios.get(`https://${BASE}/api/chats/getChats`);
      setBuyingChats(res.data.data.buyingChats);
      setSellingChats(res.data.data.sellingChats);
    } catch (e) {
      console.log(e);
      setTimeout(()=> navigate('/'),1000);
    }
  };

  useEffect(() => {
    loadChat();
  }, []);

  const message1Handler = (msg) => {
    // let done = 0;
    // if (msg.senderId == user._id) return;
    // const newBChats = buyingChats.map((chat) => {
    //   if (chat._id != msg.chatId) return chat;
    //   done = 1;
    //   return { ...chat, latestMessage: msg };
    // });
    // const newSChats = sellingChats.map((chat) => {
    //   if (chat._id != msg.chatId) return chat;
    //   console.log(2);
    //   done = 2;
    //   return { ...chat, latestMessage: msg };
    // });
    // if (done == 0) {alert('kk');window.location.reload(false);}
    // else if(done == 1) setBuyingChats(newBChats);
    // else setSellingChats(newSChats);
    loadChat();
  };

  useEffect(() => {
    socket.emit("join", user._id);
    socket.on("message1", message1Handler);
    return () => {
      socket.off("message1", message1Handler);
    };
  }, []);

  return (
    <>
      <Navigation user={user} />
      <br />
      <br />
      <br />
      <div className="py-10 h-auto bg-gray-300 px-2">
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
              <p>Buying...</p>
              <ul>
                {buyingChats?.reverse().map((chat) => (
                  <Link key={chat._id} to="/chat" state={{ user, chat }}>
                    <SingleChatGrid
                      chat={chat}
                      role="seller"
                      userId={user._id}
                    />
                  </Link>
                ))}
              </ul>

              <p>Selling...</p>
              <ul>
                {sellingChats?.reverse().map((chat) => (
                  <Link key={chat._id} to="/chat" state={{ user, chat }}>
                    <SingleChatGrid
                      chat={chat}
                      role="buyer"
                      userId={user._id}
                    />
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

export default AllChatList;
