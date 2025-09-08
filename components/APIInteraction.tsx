import React, { useState } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface APIInteractionResponse {
    status: number;
    headers?: Record<string, string>;
    body: unknown; // Allow any type for the body to make the component more robust.
    isError?: boolean;
    isRawText?: boolean;
}

interface APIInteractionProps {
    method: HttpMethod;
    path: string;
    editablePart?: string;
    onEditablePartChange?: (value: string) => void;
    body?: string;
    onBodyChange?: (value: string) => void;
    onSendRequest: () => Promise<APIInteractionResponse | any>;
    analysisPanel?: React.ReactNode;
    onRequestStart?: () => void;
    onSuccess?: (responseBody: any) => void;
}

const JsonSyntaxHighlight: React.FC<{ json: unknown }> = ({ json }) => {
    let content: string;
    try {
        if (typeof json === 'string') {
            content = json;
        } else if (json === undefined) {
            content = 'undefined';
        } else {
            content = JSON.stringify(json, null, 2);
        }
    } catch (e: unknown) {
        content = `[Error: Could not render response body]: ${(e as Error).message}`;
    }
    return <pre className="text-sm whitespace-pre-wrap break-all">{content}</pre>;
};

export const APIInteraction: React.FC<APIInteractionProps> = ({
    method,
    path,
    editablePart,
    onEditablePartChange,
    body,
    onBodyChange,
    onSendRequest,
    analysisPanel,
    onRequestStart,
    onSuccess,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<APIInteractionResponse | null>(null);
    const [activeTab, setActiveTab] = useState<'response' | 'analysis'>('response');

    const handleSubmit = async () => {
        setIsLoading(true);
        setResponse(null);
        if (onRequestStart) {
            onRequestStart();
        }
        try {
            const res = await onSendRequest();
            // Normalize response
            let finalResponse: APIInteractionResponse;
            if (res.status === undefined) {
                finalResponse = { status: 200, body: res };
            } else {
                finalResponse = res;
            }
            setResponse(finalResponse);

            if (!finalResponse.isError && onSuccess) {
                onSuccess(finalResponse.body);
            }
        } catch (err: unknown) {
            const error = err as Error;
            setResponse({
                status: 500,
                body: { error: error.message },
                isError: true,
            });
        } finally {
            setIsLoading(false);
            setActiveTab('response');
        }
    };

    const isJsonBody = onBodyChange !== undefined;

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg border border-white/10">
            {/* Request Panel */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-sm overflow-hidden">
                        <span className={`font-bold px-2 py-0.5 rounded-md text-white
                            ${method === 'GET' && 'bg-sky-600'}
                            ${method === 'POST' && 'bg-green-600'}
                        `}>{method}</span>
                        <span className="text-gray-400 whitespace-nowrap">{path}</span>
                        {onEditablePartChange && (
                            <input
                                type="text"
                                value={editablePart}
                                onChange={(e) => onEditablePartChange(e.target.value)}
                                className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-24"
                                disabled={isLoading}
                            />
                        )}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l16-5.333a.75.75 0 000-1.418l-16-5.333z" /></svg>
                        )}
                        Enviar Requisição
                    </button>
                </div>
                {isJsonBody && (
                    <div className="mt-4">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Corpo da Requisição (JSON)</label>
                        <textarea
                            value={body}
                            onChange={(e) => onBodyChange(e.target.value)}
                            className="w-full h-32 bg-gray-900/80 border border-gray-700 rounded p-2 font-mono text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            disabled={isLoading}
                            spellCheck="false"
                        />
                    </div>
                )}
            </div>

            {/* Response Area */}
            {(isLoading || response) && (
                <div className="p-4">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-gray-400">
                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-400"></div>
                             <span>Aguardando resposta do servidor...</span>
                        </div>
                    )}
                    {response && (
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-white">Resposta</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-sm font-semibold
                                        ${response.isError ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}
                                    >
                                        Status: {response.status}
                                    </span>
                                </div>
                                 {analysisPanel && (
                                    <div className="flex gap-1 bg-gray-800/50 p-1 rounded-md">
                                        <button onClick={() => setActiveTab('response')} className={`px-3 py-1 text-xs rounded ${activeTab === 'response' ? 'bg-sky-600 text-white' : 'text-gray-300'}`}>Resposta</button>
                                        <button onClick={() => setActiveTab('analysis')} className={`px-3 py-1 text-xs rounded ${activeTab === 'analysis' ? 'bg-sky-600 text-white' : 'text-gray-300'}`}>Análise</button>
                                    </div>
                                )}
                            </div>
                           
                            <div className="mt-4">
                                {activeTab === 'response' ? (
                                    <div className="bg-gray-900/80 rounded p-3 text-gray-300 max-h-96 overflow-y-auto">
                                        <JsonSyntaxHighlight json={response.body}/>
                                    </div>
                                ) : (
                                    <div className="bg-gray-900/30 rounded p-4 text-gray-300">
                                        {analysisPanel}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};