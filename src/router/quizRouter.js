import {lazy, Suspense} from "react";
import AdminUserList from "../component/admin/AdminUserList";
import App from "../App";

const Loading = () => <div>Loading....</div>
const List = lazy(() => import("./../component/quiz/List"));
const QuizCreate = lazy(() => import("./../component/quiz/QuizCreateModal"));

const quizRouter = () => {
    return [
        {
            path: "modal",
            element: <Suspense fallback={<Loading />}><QuizCreate/> </Suspense>,
        }
    ]
}

export default quizRouter;