import './App.css';
import Nav from "./component/Nav"
import Main from "./component/Main";
import {Route, Routes} from "react-router-dom";
import ListPage from "./component/quiz/ListPage";
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
import Myprofile from "./component/user/Myprofile";
import AdminQuizList from "./component/admin/AdminQuizList";
import AdminDashboard from "./component/admin/AdminDashboard";
import AdminUserList from "./component/admin/AdminUserList";
function App() {
  return (
    <div className="App">
        <Nav/>
        <div className="main-content">
            <Routes>
                <Route path="/" element={<Main></Main>} />
                <Route path="/list" element={<ListPage></ListPage>} />
                <Route path="/quiz/modal" element={<QuizCreateModal></QuizCreateModal>} />
                <Route path="/quiz" element={<Quiz></Quiz>}/>
                <Route path="/preview" element={<PreviewPage></PreviewPage>} />
                <Route path="/lobby" element={<Lobby></Lobby>} />
                <Route path="/participation" element={<Participation></Participation>} />
                <Route path="/hostLobby" element={<HostLobby></HostLobby>} />
                <Route path="/gamePlay/Host" element={<GamePlayHost></GamePlayHost>}/>
                <Route path="/gamePlay" element={<GamePlay></GamePlay>}/>
                <Route path="/signUp" element={<SignUp></SignUp>} />
                <Route path="/signIn" element={<SignIn></SignIn>} />
                <Route path="/myProfile" element={<Myprofile></Myprofile>}/>
                <Route path="/admin/quiz/list" element={<AdminQuizList></AdminQuizList>}/>
                <Route path="/admin/user/list" element={<AdminUserList></AdminUserList>}/>
                <Route path="/admin/dashboard" element={<AdminDashboard></AdminDashboard>}/>
            </Routes>
        </div>

    </div>
  );
}

export default App;
