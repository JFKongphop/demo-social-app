import { useEffect, useState, createContext } from "react";

export const DarkModeContext = createContext();

export const DarkModeProvider = (props) => {

    const [darkMode, setDarkMode] = useState(
        JSON.parse(localStorage.getItem('darkMode')) || false
    );

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    }

    // detect the changing all time when click by multiple times
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode]);

    return (
        <DarkModeContext.Provider
            value={{
                darkMode: darkMode, 
                toggleDarkMode: toggleDarkMode
            }}
        >
            {props.children}
        </DarkModeContext.Provider>
    )
}