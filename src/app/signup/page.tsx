"use client"
import { useState } from "react"
import Link from "next/link"
import { doc, setDoc } from "firebase/firestore";
import { auth, app, db } from "@/lib/firebase/config"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
export default function SignUp() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter();

    const handleGoogleSignUp = async () => {
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

            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        }
    };

    const handlesingup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const usercreds = await createUserWithEmailAndPassword(auth, email, password)
            const userinfo = usercreds.user;

            await setDoc(doc(db, "users", userinfo.uid), {
                fullName: fullName,
                email: email,
            })
            router.push("/dashboard");

        } catch (err: any) {
            console.error(err);
            setError(err.message)
        }
    }
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#0B1120] p-4 font-sans">
            <div className="w-full max-w-[420px] flex flex-col bg-[#0F172A] rounded-2xl border border-slate-800/80 shadow-2xl relative z-10 transition-all overflow-hidden">

                <div className="p-8 pb-6">
                    {/* Back Button */}
                    <Link href="/login" className="mb-6 inline-block text-slate-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>

                    {/* Title */}
                    <h1 className="font-bold text-white text-center text-[26px] tracking-tight mb-2 font-display">Join Us</h1>

                    {/* Subtitle */}
                    <p className="text-[#94A3B8] text-center text-[14px] mb-8 leading-relaxed">
                        Enter your details to create an account
                    </p>

                    {/* Form */}
                    <form className="flex flex-col gap-4" onSubmit={handlesingup}>
                        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white text-[13px] font-semibold px-0.5">Full Name</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 text-slate-400">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-[#1A2234]/50 text-white border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500/80"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white text-[13px] font-semibold px-0.5">Email Address</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 text-slate-400">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1A2234]/50 text-white border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500/80"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white text-[13px] font-semibold px-0.5">Password</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 text-slate-400">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1A2234]/50 text-white border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-[14px] tracking-widest focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500/80 placeholder:tracking-normal"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-white text-[13px] font-semibold px-0.5">Confirm</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 text-slate-400">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#1A2234]/50 text-white border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-[14px] tracking-widest focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500/80 placeholder:tracking-normal"
                                />
                            </div>
                        </div>

                        {/* Main Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg px-4 py-3.5 text-[15px] mt-2 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                        >
                            Create Account
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center py-2 mt-1">
                            <div className="flex-grow border-t border-slate-700/60"></div>
                            <span className="flex-shrink-0 px-3 text-slate-400/80 text-[12px] font-medium">
                                Or continue with
                            </span>
                            <div className="flex-grow border-t border-slate-700/60"></div>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex gap-4 mb-2">
                            <button type="button" onClick={handleGoogleSignUp} className="flex-1 flex items-center justify-center gap-2 bg-[#1A2234]/40 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold rounded-xl px-4 py-3 transition-all text-[13px]">
                                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-[13px] text-slate-400 mt-2">
                            Already have an account? <Link href="/login" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">Sign in</Link>
                        </p>
                    </form>
                </div>

                {/* Footer Area */}
                <div className="bg-[#1A2234]/30 w-full p-4 border-t border-slate-800/80">
                    <p className="text-center text-[11px] text-slate-500/80 leading-relaxed px-4">
                        By signing up, you agree to our <a href="#" className="text-slate-400 hover:text-slate-300">Terms of Service</a> and <a href="#" className="text-slate-400 hover:text-slate-300">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
