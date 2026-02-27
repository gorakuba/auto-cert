import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [errorMsg, setErrorMsg] = useState("");
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current) return;

        if (!token) {
            setStatus("error");
            setErrorMsg("Brak tokenu aktywacyjnego w linku.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`/api/auth/verify-email?token=${token}`);
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Nieprawidłowy lub wygasły token.");
                }
                setStatus("success");
            } catch (err: any) {
                setStatus("error");
                setErrorMsg(err.message);
            } finally {
                effectRan.current = true;
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-gray-100 text-center animate-in slide-in-from-bottom-5 duration-500">

                {status === "verifying" && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mb-6" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Weryfikujemy konto...</h2>
                        <p className="text-gray-500 text-sm">Proszę czekać, to potrwa tylko chwilę.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-sm border border-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Konto aktywowane!</h2>
                        <p className="text-gray-600 mb-8 text-sm">Twój adres email został pomyślnie zweryfikowany. Możesz się teraz zalogować.</p>
                        <Link
                            to="/login"
                            className="w-full inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Przejdź do logowania
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center animate-in shake duration-500">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Weryfikacja nie powiodła się</h2>
                        <p className="text-red-600 mb-8 font-medium">{errorMsg}</p>
                        <Link
                            to="/verify-email-pending"
                            className="w-full inline-block bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all shadow-sm"
                        >
                            Wyślij link aktywacyjny ponownie
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};
