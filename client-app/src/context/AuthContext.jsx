import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {

    // will change to null
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem('user')) || false
    );

    const login = () => {
        setCurrentUser({
            id: '1',
            name: 'John Doe',
            profilePic: 
                'https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600'
        })
    }

    // detect the changing all time when click by multiple times
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider
            value={{
                currentUser: currentUser,
                login: login
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}