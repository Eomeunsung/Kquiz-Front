import {createBrowserRouter} from "react-router-dom";
import Nav from "./../component/Nav";
import {lazy, Suspense} from "react";
import quizRouter from "./quizRouter";
import adminRouter from "./adminRouter"

const Loading = ()=> <div>Loading....</div>
const Main = lazy(()=>import("./../component/Main"))
const List = lazy(()=>import("../component/quiz/List"))
const Preview = lazy(()=>import("./../component/quiz/previewPage"))
const Lobby = lazy(()=>import("./../component/gamePlay/Lobby"))
const HostLobby = lazy(()=>import("./../component/gamePlay/HostLobby"))
const AdminDashboard = lazy(() => import("./../component/admin/AdminDashboard"));
const SingIn = lazy(() => import("./../component/user/SignIn"));
const SingUp = lazy(()=>import("./../component/user/SignUp"));
const MyProfile = lazy(() => import("../component/user/MyProfile"));
const Quiz = lazy(() => import("./../component/quiz/Quiz"));
const Participation = lazy(() => import("./../component/gamePlay/Participation"));
const GamePlay = lazy(() => import("./../component/gamePlay/GamePlay"));
const GamePlayHost = lazy(() => import("./../component/gamePlay/GamePlayHost"));

const root = createBrowserRouter([
    {
        element: <Nav/>,
        children:[
            {
                path:'/',
                element: <Suspense fallback={<Loading/>}><Main/></Suspense>
            },
            {
                path:"/list",
                element: <Suspense fallback={<Loading/>}><List/></Suspense>,
                children: quizRouter()
            },
            {
              path: "/quiz",
              element: <Suspense fallback={<Loading/>}><Quiz/></Suspense>
            },
            {
                path: "/preview",
                element: <Suspense fallback={<Loading/>}><Preview/></Suspense>
            },
            {
                path: "/Lobby",
                element: <Suspense fallback={<Loading/>}><Lobby/></Suspense>
            },
            {
                path: "/hostLobby",
                element: <Suspense fallback={<Loading/>}><HostLobby/></Suspense>
            },
            {
              path: "/participation",
              element: <Suspense fallback={<Loading/>}><Participation/></Suspense>
            },
            {
                path: "/gamePlay",
                element: <Suspense fallback={<Loading/>}><GamePlay/></Suspense>
            },
            {
                path: "/gamePlay/host",
                element: <Suspense fallback={<Loading/>}><GamePlayHost/></Suspense>
            },
            {
                path: "/signIn",
                element: <Suspense fallback={<Loading/>}><SingIn/></Suspense>
            },
            {
              path: "/signUp",
              element: <Suspense fallback={<Loading/>}><SingUp/></Suspense>
            },
            {
              path:"/myProfile",
              element: <Suspense fallback={<Loading/>}><MyProfile/></Suspense>
            },
            {
                path: "/admin",
                element: <Suspense fallback={<Loading/>}><AdminDashboard/></Suspense>,
                children: adminRouter()
            }
        ]
    }
])

export default root;