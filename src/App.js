import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import AskOTP from "./pages/AskOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateProduct from "./pages/CreateProduct";
import LogOut from "./pages/LogOut";
import UpdateProduct from "./pages/UpdateProduct";
import Info from "./pages/Info";
import ShowProduct from "./pages/ShowProduct";
import UserPage from "./pages/UserPage";
import Chat from "./pages/Chat";
import UpdateUser from "./pages/UpdateUser";
import ChatList from "./pages/ChatList";
import AllChatList from "./pages/AllChatList"
import UpdatePassword from "./pages/UpdatePassword";
import env from "react-dotenv";

function App() {
  // const [user, setUser] = useState();
  // const [loading, setloading] = useState(true);
  return (
    <>
      <Router>
          
          <Routes>
            <Route exact path="/" Component={Home}></Route>
            <Route path="/signup" Component={SignUp}></Route>
            <Route path="/login" Component={LogIn}></Route>
            <Route path="/askotp" Component={AskOTP}></Route>
            <Route path="/forgot-password" Component={ForgotPassword}></Route>
            <Route path="/reset-password" Component={ResetPassword}></Route>
            <Route path="/create-product" Component={CreateProduct}></Route>
            <Route path="/update-product" Component={UpdateProduct}></Route>
            <Route path="/logout" Component={LogOut}></Route>
            {/* <Route path="/demo" Component={Demo}></Route> */}
            <Route path="/show-product" Component={ShowProduct}></Route>
            <Route path="/user" Component={UserPage}></Route>
            <Route path="/chat" Component={Chat}></Route>
            <Route path="/update-user" Component={UpdateUser}></Route>
            <Route path="/chat-list" Component={ChatList}></Route>
            <Route path="/info" Component={Info}></Route>
            <Route path="/all-chat-list" Component={AllChatList}></Route>
            <Route path="/update-password" Component={UpdatePassword}></Route>
          </Routes>
      </Router>
    </>
  );
}

export default App;
