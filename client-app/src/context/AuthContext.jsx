import { useState, useEffect, createContext } from "react";
import axios from 'axios';


export const AuthContext = createContext();
export const AuthProvider = (props) => {


    // will change to null
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem('user')) || false
    );

    // set cookie with credential
    const login = async (inputs) => {
        const res = await axios.post('http://localhost:8800/api/auth/login', inputs, {
            withCredentials: true
        });

        console.log(res.data);
        setCurrentUser(res.data);
    }

    // logout
    const logout = async () => {
        const res = await axios.post('http://localhost:8800/api/auth/logout');
        console.log(res.data);
    }


    // detect the changing all time when click by multiple times
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser));
    }, [currentUser]);


    return (
        <AuthContext.Provider
            value={{
                currentUser: currentUser,
                login: login,
                logout: logout
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}