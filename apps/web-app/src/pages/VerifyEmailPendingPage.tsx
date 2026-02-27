import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const VerifyEmailPendingPage = () => {
    const location = useLocation();
    const emailFromState = location.state?.email || "";

    const [email, setEmail] = useState(emailFromState);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleResend = async () => {
        if (!email) {
            setErrorMsg("Podaj adres email.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error("Wystąpił błąd. Spróbuj ponownie później.");
            }

            setStatus("success");
        } catch (err: any) {
            setErrorMsg(err.message);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-gray-100 animate-in zoom-in-95 duration-500">

                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center relative shadow-inner text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <div className="absolute top-1 right-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Sprawdź skrzynkę email</h1>

                <div className="text-gray-600 text-center mb-8 text-sm space-y-2">
                    <p>
                        Wysłaliśmy link aktywacyjny na adres:
                        {email ? <span className="block font-semibold mt-1 text-gray-900">{email}</span> : " podany przy rejestracji."}
                    </p>
                    <p>Kliknij w link, aby aktywować swoje konto i móc się zalogować.</p>
                </div>

                {status === "success" && (
                    <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-100 text-sm text-center font-medium animate-in fade-in">
                        Wysłano nowy link aktywacyjny! Sprawdź pocztę.
                    </div>
                )}

                {status === "error" && (
                    <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                {!emailFromState && status !== "success" && (
                    <div className="mb-6">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-gray-50/50 text-center"
                            placeholder="Wpisz adres email"
                        />
                    </div>
                )}

                <button
                    onClick={handleResend}
                    disabled={status === "loading" || status === "success"}
                    className="w-full bg-white border-2 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-medium py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mb-4"
                >
                    {status === "loading" ? (
                        <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    ) : "Wyślij link ponownie"}
                </button>

                <div className="text-center mt-6">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Wróc do logowania
                    </Link>
                </div>

            </div>
        </div>
    );
};
