import React from 'react';
import type { User } from '../types';

interface UserProfileCardProps {
  user: Partial<User>;
}

const InfoRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
  <div className="flex justify-between border-t border-gray-500/50 py-3 text-sm">
    <span className="font-semibold text-gray-300">{label}</span>
    <span className="text-gray-100">{value || 'N/A'}</span>
  </div>
);

const SensitiveInfoRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div className="flex justify-between border-t border-red-500/50 bg-red-900/30 -mx-6 px-6 py-3 text-sm">
      <span className="font-semibold text-red-300">{label}</span>
      <span className="font-bold text-red-200">{value || 'N/A'}</span>
    </div>
  );


export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="p-6">
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-lg">
                    {user.name ? user.name.charAt(0) : '?'}
                </div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-sky-300">{user.email}</p>
            </div>
            <div className="mt-6">
                <InfoRow label="ID do Usuário" value={user.id} />
                <InfoRow label="Cargo" value={user.role} />
                <InfoRow label="Departamento" value={user.department} />
                <InfoRow label="Último Login" value={user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'N/A'} />
            </div>
        </div>
        {(user.salary !== undefined || user.personalNotes) && (
            <div className="px-6 pb-6">
                 <div className="text-center mb-2 text-red-400 text-xs font-semibold">DADOS SENSÍVEIS EXPOSTOS</div>
                {user.salary !== undefined && <SensitiveInfoRow label="Salário (Anual)" value={`R$ ${user.salary.toLocaleString('pt-BR')}`} />}
                {user.personalNotes && <SensitiveInfoRow label="Notas Pessoais" value={user.personalNotes} />}
            </div>
        )}
      </div>
    </div>
  );
};