import { useContext } from 'react';
import { useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Outlet,
    Navigate
} from "react-router-dom";
import LeftBar from './components/leftBar/LeftBar';
import Navbar from './components/navbar/Navbar';
import RightBar from './components/rightBar/RightBar';
import { AuthContext } from './context/AuthContext';
import { DarkModeContext } from './context/DarkmodeContext';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Register from './pages/register/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './style.scss'


function App() {

    // check status of new or old user
    const { currentUser } = useContext(AuthContext);
    const { darkMode } = useContext(DarkModeContext);
    // console.log(currentUser);

    // console.log(darkMode);

    const queryClient = new QueryClient()

    

    // encapsulate of home page by all bars when 
    // then the home page is outlet in the middle of all bars
    const Layout = () => {
        return (
            <QueryClientProvider client={queryClient}>
                <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
                    <Navbar/>
                    <div style={{ display: 'flex'}}>
                        <LeftBar/>
                        <div style={{ flex: 6 }}>
                            <Outlet/>
                        </div>
                        
                        <RightBar/>
                    </div>
                </div>
            </QueryClientProvider>
        )
    }

    // when it not auth is redirect login page
    // otherwise, passing auth redirect home page by children
    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to='/login' />;
        }

        return children;
    }
    
    // Pages at the Outlet is in children array
    // wrapping the element by protectRoute of checking auth
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <Layout/>
                </ProtectedRoute>
            ),
            children: [
                {
                    path: '/',
                    element: <Home/>
                },                
                {
                    path: '/profile/:id',
                    element: <Profile/>
                },
            ]
        },
        {
          path: "/login",
          element: <Login/>,
        },
        {
            path: "/register",
            element: <Register/>,
        }
    ]);

    return (
        <div>
            <RouterProvider router={router} />
        </div>
    )
}

export default App;