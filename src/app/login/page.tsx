"use client"
import { useState, useEffect } from "react"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true") {
            router.push("/dashboard");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (typeof window !== "undefined") {
                localStorage.setItem("isLoggedIn", "true");
            }
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError("Invalid email or password");
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const userinfo = result.user;
            await setDoc(doc(db, "users", userinfo.uid), {
                fullName: userinfo.displayName || "Google User",
                email: userinfo.email,
                avatarUrl: userinfo.photoURL
            }, { merge: true });

            if (typeof window !== "undefined") {
                localStorage.setItem("isLoggedIn", "true");
            }
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        }
    };



    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#0B1120] p-4 font-sans">
            <div className="w-full max-w-[400px] flex flex-col bg-[#111827] rounded-3xl border border-slate-800/80 p-8 shadow-2xl relative z-10 transition-all">

                {/* Logo */}
                <div className="w-full flex justify-center mb-5">
                    <div className="flex items-center justify-center w-[46px] h-[46px] rounded-[14px] bg-[#1E293B] shadow-inner">
                        <svg
                            className="w-5 h-5 text-[#3B82F6]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="font-bold text-white text-center text-[22px] tracking-tight mb-2">DSA Tracker</h1>

                {/* Subtitle */}
                <p className="text-[#94A3B8] text-center text-[13px] mb-8 leading-relaxed px-2">
                    Master your algorithms and track your progress across platforms.
                </p>

                {/* Form */}
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-300 text-[13px] font-medium px-0.5">Email address</label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3 text-slate-400">
                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="dev@dsatracker.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1A2234]/80 text-white border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500/80"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex justify-between items-center px-0.5">
                            <label className="text-slate-300 text-[13px] font-medium">Password</label>
                            <a href="#" className="text-blue-500 hover:text-blue-400 text-[12px] font-medium transition-colors">Forgot password?</a>
                        </div>
                        <div className="relative flex items-center">
                            <div className="absolute left-3 text-slate-400">
                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1A2234]/80 text-white border border-slate-700/50 rounded-xl pl-10 pr-10 py-2.5 text-sm tracking-widest focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500/80 placeholder:tracking-normal"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-slate-400 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2.5 mt-2 mb-1 px-0.5">
                        <button
                            type="button"
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-all ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-transparent'}`}
                        >
                            {rememberMe && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                        <span className="text-slate-300 text-[13px] opacity-90 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>Remember me for 30 days</span>
                    </div>

                    {/* Main Buttons */}
                    <div className="flex flex-col gap-3.5 mt-2">
                        <button
                            type="submit"
                            className="w-full bg-[#307BFF] hover:bg-[#2563EB] text-white font-medium rounded-xl px-4 py-3 text-sm transition-all focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                        >
                            Log in
                        </button>

                        <a
                            href="/signup"
                            className="w-full flex items-center justify-center bg-[#1A2234]/70 hover:bg-slate-800 text-white border border-slate-700/60 font-medium rounded-xl px-4 py-3 text-sm transition-all focus:ring-4 focus:ring-slate-500/20 focus:outline-none"
                        >
                            Create account
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center py-2 mt-2">
                        <div className="flex-grow border-t border-slate-700/60"></div>
                        <span className="flex-shrink-0 px-4 text-slate-500/80 text-[11px] font-semibold uppercase tracking-widest">
                            Or continue with
                        </span>
                        <div className="flex-grow border-t border-slate-700/60"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-3">
                        <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-[#1A2234]/70 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-medium rounded-xl px-4 py-2.5 transition-all text-[13px]">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-[10px] sm:text-[11px] font-semibold tracking-widest text-slate-500/60 z-10 relative">
                © 2024 DSA PROBLEM SOLVER TRACKER • BUILD FOR SPEED
            </div>
        </div>
    )
}