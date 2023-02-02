import { useState, useEffect, createContext } from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';


export const AuthContext = createContext();
export const AuthProvider = (props) => {

    

    // will change to null
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem('user')) || false
    );


    const cookies = new Cookies();
    console.log(cookies.get('accessToken'));
    // set cookie with credential
    const login = async (inputs) => {
        const res = await axios.post('http://localhost:8800/api/auth/login', inputs, {
            withCredentials: true
        });

        setCurrentUser(res.data);
    }

    // detect the changing all time when click by multiple times
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser));
        //setCookie(cookies.get('accessToken'))
    }, [currentUser]);

    //console.log(cookie);

    return (
        <AuthContext.Provider
            value={{
                currentUser: currentUser,
                login: login,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}