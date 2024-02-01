import { useSelector } from "react-redux"
import { Outlet,Navigate } from "react-router-dom"

// the diffrence between navigate and useNavigate is that navigate is a function that you can call anywhere in your app
// while useNavigate is a hook that you can only call inside a component
function PrivateRoute() {
 const {currentUser} = useSelector((state) => state.user)

 return currentUser ? <Outlet /> : <Navigate to="/sign-in" />
  
 
}

export default PrivateRoute
