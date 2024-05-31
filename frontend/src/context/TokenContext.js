import React, { createContext, useState, useEffect } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || null);

    useEffect(() => {
        if (userToken) {
            localStorage.setItem('userToken', userToken);
        } else {
            localStorage.removeItem('userToken');
        }
    }, [userToken]);

    return (
        <TokenContext.Provider value={{ userToken, setUserToken }}>
            {children}
        </TokenContext.Provider>
    );
};

export default TokenContext;
