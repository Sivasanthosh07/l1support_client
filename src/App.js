import React, {useState, createContext} from "react";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login"
import { Routes, Route } from "react-router-dom";
import RedirectComponent from "./Components/RedirectComponent";
import CallbackComponent from "./Components/CallbackComponent";
import ProtectedRoute from "./Components/ProtectedRoute";

export const AuthContext = createContext(null)

function App() {

  const [access_token, setAccess_token] = useState('');
  const [id_token, setId_token] = useState('')
  const [userInfo, setUserInfo] = useState({})
  const [error, setError] = useState('')

  return (
    <div style={{minHeight:"100vh", backgroundColor:"white"}}>
      <AuthContext.Provider value={{access_token, id_token, userInfo, error, setAccess_token, setId_token, setUserInfo, setError}}>
      <Routes>      
        <Route Component={Login} path="/"/>
        <Route element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } path="/home" />
        <Route Component={CallbackComponent} path="/callback" />
        <Route Component={RedirectComponent} path="/redirect" />
      </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
