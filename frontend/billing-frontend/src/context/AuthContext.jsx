// Authentication context will be added here.
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const login = (userData, jwtToken) => {

    localStorage.setItem(
        "user",
        JSON.stringify(userData)
    );

    localStorage.setItem(
        "token",
        jwtToken
    );

    setUser(userData);

    setToken(jwtToken);

};

    const logout = () => {

        localStorage.clear();

        setUser(null);

        setToken(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}