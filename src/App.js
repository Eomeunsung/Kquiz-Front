import './App.css';
import Nav from "./component/Nav"
import Main from "./component/Main";
import {Route, RouterProvider, Routes} from "react-router-dom";
import List from "./component/quiz/List";
import Quiz from "./component/quiz/Quiz";
import QuizCreateModal from "./component/quiz/QuizCreateModal";
import PreviewPage from "./component/quiz/previewPage";
import Lobby from "./component/gamePlay/Lobby";
import Participation from "./component/gamePlay/Participation";
import HostLobby from "./component/gamePlay/HostLobby";
import GamePlayHost from "./component/gamePlay/GamePlayHost";
import GamePlay from "./component/gamePlay/GamePlay";
import SignUp from "./component/user/SignUp";
import SignIn from "./component/user/SignIn";
import MyProfile from "./component/user/MyProfile";
import AdminQuizList from "./component/admin/AdminQuizList";
import AdminDashboard from "./component/admin/AdminDashboard";
import AdminUserList from "./component/admin/AdminUserList";
import AdminAuthorization from "./component/admin/AdminAuthorization";
import root from "./router/root"
function App() {
  return (
    <div className="App">
        {/*<Nav/>*/}
        <div className="main-content">
            <RouterProvider router={root}/>
            {/*<Routes>*/}
            {/*    <Route path="/quiz/modal" element={<QuizCreateModal></QuizCreateModal>} />*/}
            {/*</Routes>*/}
        </div>

    </div>
  );
}

export default App;
