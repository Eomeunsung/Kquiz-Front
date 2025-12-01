import {lazy, Suspense} from "react";

const Loading = () => <div>Loading....</div>
const AdminQuizList = lazy(() => import("./../component/admin/AdminQuizList"));
const AdminUserList = lazy(() => import("./../component/admin/AdminUserList"));
const AdminAuthorization = lazy(() => import("./../component/admin/AdminAuthorization"));
const adminRouter = () => {
    return [
        {
            path: "quiz/list",
            element: <Suspense fallback={<Loading />}><AdminQuizList/></Suspense>,
        },
        {
            path: "user/list",
            element: <Suspense fallback={<Loading/>}><AdminUserList/></Suspense>
        },
        {
            path: "access/control",
            element: <Suspense fallback={<Loading/>}><AdminAuthorization/></Suspense>
        }
    ]
}

export default adminRouter;