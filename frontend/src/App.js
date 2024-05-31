import './App.css';
import { useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Ongoing from './components/Ongoing';
import Completed from './components/Completed';
import AllTask from './components/AllTask';
import Layout from './components/Layout';
import TaskContext from './context/TaskContext';
import TokenContext from './context/TokenContext';
import taskReducer from './reducer/taskReducer';
import tokenReducer from './reducer/tokenReducer';
import userReducer from './reducer/userReducer';
import Header from './components/Header/Header';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/forgotPassword/ForgotPassword';
import ResetPassword from './components/forgotPassword/ResetPassword';
import TaskDashboard from './components/TaskDashboard'; // Import TaskDashboard component
import axios from './Axios/axios.js';

function App() {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [userToken, tokenDispatch] = useReducer(tokenReducer, token);
  const [user, userDispatch] = useReducer(userReducer, {});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/getUser", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        userDispatch({ type: "SET_USER", payload: res.data.user });
      } catch (error) {
        console.log(error);
      }
    };
    if (userToken) {
      fetchUser();
    }
  }, [userToken]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/task/getTask", {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        dispatch({ type: "SET_TASKS", payload: res.data }); // Corrected action type to "SET_TASKS"
      } catch (error) {
        console.log(error);
      }
    };
    if (userToken) {
      fetchTasks();
    }
  }, [userToken]);

  return (
    <BrowserRouter>
      <TokenContext.Provider value={{ userToken, tokenDispatch, user, userDispatch }}>
        <TaskContext.Provider value={{ tasks, dispatch }}>
          <Routes>
            <Route path="/" element={<Header />}>
              <Route path='/' element={userToken ? <Layout /> : <Login />}>
                <Route index element={<AllTask />} />
                <Route path="ongoing" element={<Ongoing />} />
                <Route path="completed" element={<Completed />} />
                <Route path="dashboard" element={<TaskDashboard />} /> {/* Render TaskDashboard component */}
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
            </Route>
          </Routes>
        </TaskContext.Provider>
      </TokenContext.Provider>
    </BrowserRouter>
  );
}

export default App;
