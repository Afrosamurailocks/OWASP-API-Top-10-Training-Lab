import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const roleColors: Record<string, string> = {
    User: 'bg-sky-500/80',
    Manager: 'bg-yellow-500/80',
    Admin: 'bg-red-500/80',
};

export const UserSwitcher: React.FC = () => {
    const { currentUser, allUsers, loginAs } = useContext(UserContext);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div>
                <p className="text-sm text-gray-400">Logado como:</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-lg text-white">{currentUser.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${roleColors[currentUser.role] || 'bg-gray-500'}`}>
                        {currentUser.role}
                    </span>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                 <span className="text-sm text-gray-300 mr-2">Trocar de perfil:</span>
                {allUsers.map(user => (
                    <button
                        key={user.id}
                        onClick={() => loginAs(user.id)}
                        disabled={currentUser.id === user.id}
                        className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200
                            ${currentUser.id === user.id
                                ? 'bg-sky-600 text-white cursor-not-allowed'
                                : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300'
                            }`}
                    >
                        {user.name.split(' ')[0]}
                    </button>
                ))}
            </div>
        </div>
    );
};