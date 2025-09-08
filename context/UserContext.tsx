import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { getMockUsers, getUserById } from '../services/api';

interface UserContextType {
    currentUser: User | null;
    allUsers: User[];
    loginAs: (userId: string) => void;
}

export const UserContext = createContext<UserContextType>({
    currentUser: null,
    allUsers: [],
    loginAs: () => {},
});

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        const users = getMockUsers();
        setAllUsers(users);
        if (users.length > 0) {
            // Define o primeiro usuário como o padrão ao carregar
            setCurrentUser(users[0]);
        }
    }, []);

    const loginAs = (userId: string) => {
        const userToLogin = getUserById(userId);
        if (userToLogin) {
            setCurrentUser(userToLogin);
        } else {
            console.error(`Tentativa de login com usuário desconhecido: ${userId}`);
        }
    };

    const value = {
        currentUser,
        allUsers,
        loginAs,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};