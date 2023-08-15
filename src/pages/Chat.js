import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "./../socket";
import EmojiPicker from "emoji-picker-react";
import { ToastContainer, toast } from "react-toastify";
let BASE=process.env.REACT_APP_BACK_END_ROOT

axios.defaults.withCredentials = true;
const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkBlock, setCheckBlock] = useState(true);
  let chat = location.state.chat;
  let user = location.state.user;
  //if(!user || !chat)navigate('/');

  const getOther = () => {
    if (chat.sellerId?._id) {
      if (chat.sellerId._id == user._id)
        return {
          ...chat.buyerId,
          lastSeen: chat.lastSeenByBuyer,
          lastRecieve: chat.lastRecieveByBuyer,
        };
      else
        return {
          ...chat.sellerId,
          lastSeen: chat.lastSeenBySeller,
          lastRecieve: chat.lastRecieveBySeller,
        };
    } else {
      if (chat.sellerId == user._id)
        return {
          _id: chat.buyerId,
          username: "user",
          image: "xyz.png",
          lastSeen: chat.lastSeenByBuyer,
          lastRecieve: chat.lastRecieveByBuyer,
        };
      else
        return {
          _id: chat.sellerId,
          username: "user",
          image: "xyz.png",
          lastSeen: chat.lastSeenBySeller,
          lastRecieve: chat.lastRecieveBySeller,
        };
    }
  };
  let other = getOther();
  const [messages, setMessages] = useState([]);
  const [mess, setMess] = useState();
  const [connected, setConnected] = useState(false);
  const [canType, setCanType] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [lastSeenTime, setLastSeenTime] = useState(
    new Date(Date.parse(other.lastSeen))
  );
  const [lastRecieveTime, setLastRecieveTime] = useState(
    new Date(Date.parse(other.lastRecieve))
  );

  const loadChat = async () => {
    try {
      const res2 = await axios.get(
        `https://${BASE}/api/chats/getChat/` + chat._id
      );
      chat = res2.data.data.chat;
      other = getOther();
      if (other.lastSeen != lastSeenTime)
        setLastSeenTime(new Date(Date.parse(other.lastSeen)));
      if (other.lastRecieve != lastRecieveTime)
        setLastRecieveTime(new Date(Date.parse(other.lastRecieve)));
      const res = await axios.get(
        `https://${BASE}/api/messages/getMessages/` + chat._id
      );
      const previous = res.data.data.messages.reverse();
      setMessages(previous);
    } catch (e) {
      console.log(e);
    }
  };

  const getLocalTime = (date, ticks = false) => {
    const newDate = new Date(Date.parse(date));
    if (ticks) {
      if (newDate?.getTime() < lastSeenTime?.getTime()) ticks = "✓✓ | ";
      else if (newDate?.getTime() < lastRecieveTime?.getTime()) ticks = "✓ | ";
      else ticks = "";
    } else ticks = "";
    const disp = `${ticks} ${newDate.getHours()}:${newDate.getMinutes()}`;
    return disp;
  };

  const sendMessages = () => {
    if (mess && mess.length > 0)
      socket.emit("message", {
        content: mess,
        senderId: user._id,
        chatId: chat._id,
        recieverId: other._id,
      });
    setMess("");
  };

  const changeReveal = async () => {
    if (chat.sReveal && chat.bReveal) return;
    if (chat.sReveal && chat.sellerId == user.id) return;
    if (chat.bReveal && chat.buyerId == user._id) return;

    socket.emit("reveal", {
      senderId: other._id,
      recieverId: user._id,
      chatId: chat._id,
    });
  };

  const recieveHandler = (chatId) => {
    console.log("recieve");
    if (chat._id != chatId) return;
    setLastRecieveTime(new Date(Date.now()));
  };

  const seenHandler = (chatId) => {
    console.log("seen");
    if (chat._id != chatId) return;
    setLastSeenTime(new Date(Date.now()));
  };

  const message1Handler = (msg) => {
    console.log("message");
    if (chat._id != msg.chatId) return;
    if (msg.senderId != user._id)
      socket.emit("seen", {
        chatId: chat._id,
        senderId: other._id,
        recieverId: user._id,
      });
    setMessages((prev) => [msg, ...prev]);
  };

  const disableTypingHandler = (chatId) => {
    console.log("disable");
    if (chat._id != chatId) return;
    setCanType(false);
    setTimeout(() => setCanType(true), 2000);
  };

  const revealHandler = async (chatId) => {
    console.log("reveal");
    if (chat._id != chatId) return;
    try {
      const newChat = await axios.get(
        `https://${BASE}/api/chats/getChat` + chat._id
      );
      navigate("/chat", {
        state: {
          user,
          data: location.state.data,
          chat: newChat.data.data.chat,
        },
      });
    } catch (e) {
      navigate("/");
    }
  };

  const typingHandler = (chatId) => {
    console.log("typing");
    if (chat._id != chatId) return;
    setOtherTyping(true);
    setTimeout(() => setOtherTyping(false), 2000);
  };

  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("connected", () => {
      setConnected(true);
      setCanType(true);
    });

    socket.emit("seen", {
      senderId: other._id,
      recieverId: user._id,
      chatId: chat._id,
    });

    socket.on("typing", typingHandler);

    socket.on("reveal", revealHandler);

    socket.on("disableTyping", disableTypingHandler);

    socket.on("message1", message1Handler);

    socket.on("seen", seenHandler);

    socket.on("recieve", recieveHandler);

    return () => {
      socket.off("recieve", recieveHandler);
      socket.off("seen", seenHandler);
      socket.off("message1", message1Handler);
      socket.off("disableTyping", disableTypingHandler);
      socket.off("reveal", revealHandler);
      socket.off("typing", typingHandler);
    };
  }, []);

  useEffect(() => {
    loadChat();
    setCheckBlock(chat.active);
  }, []);

  const showMessages = () => {
    const show = messages?.map((message) => {
      if (message?.senderId === user._id) {
        return (
          <div className="chat-message" key={message._id}>
            <div className="flex items-end justify-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                    {message.content}
                  </span>
                </div>
                <span className="w-100 h-6 rounded-full order-2">
                  <sup>{getLocalTime(message.createdAt, true)}</sup>
                </span>
              </div>
              {/* <img
                  src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                  alt="My profile"
                  className="w-6 h-6 rounded-full order-2"
                /> */}
            </div>
          </div>
        );
      } else {
        return (
          <div className="chat-message" key={message._id}>
            <div className="flex items-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                    {message.content}
                  </span>
                </div>
                <span className="w-100 h-6 rounded-full order-1">
                  <sup>{getLocalTime(message.createdAt)}</sup>
                </span>
              </div>
              {/* <img
                  src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                  alt="My profile"
                  className="w-6 h-6 rounded-full order-2"
                /> */}
            </div>
          </div>
        );
      }
    });
    return show;
  };

  const [picker, setPicker] = useState(false);

  const enablePicker = () => {
    console.log(picker);
    if (!picker) {
      setPicker(true);
    } else {
      setPicker(false);
    }
  };
  const displayEmoji = () => {
    if (picker) {
      return (
        <EmojiPicker
          emojiStyle="facebook"
          theme="dark"
          height={300}
          width={300}
          previewConfig={{
            showPreview: false,
          }}
          onEmojiClick={(e) => {
            console.log(e.emoji);
            setMess(mess + e.emoji);
          }}
        />
      );
    } else {
      return <></>;
    }
  };

  // console.log(chat);
  console.log(location);
  console.log(checkBlock);
  const changeBlock = async () => {
    try {
      const res = await axios.post(
        `https://${BASE}/api/chats/blockChat`,
        {
          chatId: chat._id,
        }
      );
      if (res.status === 200) {
        chat.active=false;
        setCheckBlock(false);
        navigate("/chat", {
          state: {
            user,
            chat
          },
        });
      }
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
  const handleBlock = () => {
    if (checkBlock) {
      return (
        <form action="#" disabled={!canType}>
          {displayEmoji()}
          <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            {otherTyping ? <div>Typing...</div> : <>.</>}
            {!canType ? (
              <div>You typing from other device. disabled...</div>
            ) : (
              <>.</>
            )}
            <div className="relative flex">
              {/* <span className="absolute inset-y-0 flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              </span> */}

              <input
                type="text"
                placeholder="Write your message!"
                value={mess}
                onChange={(e) => {
                  setMess(e.target.value);
                  socket.emit("typing", {
                    senderId: user._id,
                    recieverId: other._id,
                    chatId: chat._id,
                  });
                }}
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              />
              <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                {/* <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button> */}
                {/* <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button> */}

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                  onClick={enablePicker}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    sendMessages();
                    setPicker(false);
                  }}
                >
                  <span className="font-bold">Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 ml-2 transform rotate-90"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      );
    } else {
      return (
        <>
          <div className="w-full h-12 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3">
            <div className="w-full text-center">
              <h2 className="">
                This Chat has been Blocked. You can't message any more
              </h2>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <>
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
          <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
            <div className="relative flex items-center space-x-4">
              <div className="relative">
                {/* <span className="absolute text-green-500 right-0 bottom-0">
                  <svg width={20} height={20}>
                    <circle cx={8} cy={8} r={8} fill="currentColor" />
                  </svg>
                </span> */}
                <img
                  src={`https://${BASE}/images/users/${other.image}`}
                  alt=""
                  className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="text-2xl mt-1 flex items-center">
                  <span className="text-gray-700 mr-3">{other.username}</span>
                </div>
                {/* <span className="text-lg text-gray-600">Junior Developer</span> */}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>*/}
              <button
                type="button"
                onClick={(e) => {
                  navigate("/");
                }}
                className="inline-flex items-center justify-center rounded-lg border h-10 w-20 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  className="w-4 h-4 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="grey"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9"
                  />
                </svg>

                <span> Home</span>
              </button>
              {/* <button
                type="button"
                onClick={(e) => {
                  changeReveal();
                }}
                className="inline-flex items-center justify-center rounded-lg border h-10 w-20 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                </svg>
                <span>Reveal</span>
              </button> */}
              {checkBlock ? (
                <button
                  type="button"
                  onClick={(e) => {
                    changeBlock();
                  }}
                  className="inline-flex items-center justify-center rounded-lg border h-10 w-20 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    className="w-5 h-5 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                  <span>Block</span>
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div
            id="messages"
            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            style={{ flexDirection: "column-reverse" }}
          >
            {showMessages()}
          </div>
          <button
            className="rounded-full h-12 w-12 border-2 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300"
            onClick={() => {
              const ele = document.getElementById("messages");
              ele.scrollTop = ele.scrollHeight;
            }}
          >
            ↓
          </button>
          {handleBlock()}
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n.scrollbar-w-2::-webkit-scrollbar {\n  width: 0.25rem;\n  height: 0.25rem;\n}\n\n.scrollbar-track-blue-lighter::-webkit-scrollbar-track {\n  --bg-opacity: 1;\n  background-color: #f7fafc;\n  background-color: rgba(247, 250, 252, var(--bg-opacity));\n}\n\n.scrollbar-thumb-blue::-webkit-scrollbar-thumb {\n  --bg-opacity: 1;\n  background-color: #edf2f7;\n  background-color: rgba(237, 242, 247, var(--bg-opacity));\n}\n\n.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n}\n",
          }}
        />
      </>
      <ToastContainer />
    </>
  );
};

export default Chat;
