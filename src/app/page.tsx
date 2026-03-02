"use client";

import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
    const [step, setStep] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true") {
            router.push("/dashboard");
        }
    }, [router]);

    const slides = [
        {
            title: (
                <>
                    Track Your DSA<br />Journey
                </>
            ),
            description: "Stay consistent and visualize your progress across platforms like LeetCode.",
        },
        {
            title: (
                <>
                    Deep Dive Into<br />Analytics
                </>
            ),
            description: "Analyze your difficulty breakdowns, submission heatmaps, and consistency streaks.",
        },
    ];

    const handleNext = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            setStep(2);
        }
    };

    return (
        <main className="min-h-screen w-full bg-[#0b101e] flex flex-col items-center justify-center relative font-sans overflow-hidden">

            {/* Top Banner / Actions */}
            <div className="w-full flex justify-end p-6 absolute top-0 z-20 max-w-7xl mx-auto right-0 left-0">
                {step < 2 && (
                    <button
                        onClick={() => setStep(2)}
                        className="text-[#64748b] hover:text-white transition-colors text-[15px] font-medium tracking-wide"
                    >
                        Skip
                    </button>
                )}
            </div>

            {/* Main Responsive Container */}
            <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-12 h-screen max-h-[900px]">

                {/* Hero Image Section (Scales beautifully on Desktop) */}
                <div className="relative w-full max-w-[480px] lg:max-w-[600px] h-[45vh] lg:h-[70vh] flex flex-col justify-end items-center mb-6 lg:mb-0 lg:order-2">

                    {/* Background Image Container */}
                    <div className="absolute top-0 w-[90%] lg:w-[100%] h-[110%] rounded-2xl lg:rounded-[40px] overflow-hidden shadow-2xl skew-y-[-2deg] opacity-60 transition-all duration-700">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b101e]/60 to-[#0b101e] z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101e] via-transparent to-transparent z-10 h-1/2 bottom-0" />
                        <img
                            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1080&auto=format&fit=crop"
                            alt="Laptop with code"
                            className="w-full h-full object-cover opacity-80 mix-blend-screen scale-110 blur-[1px]"
                        />
                    </div>

                    {/* The Central Navy Blue Icon Box */}
                    <div className="relative z-20 w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] bg-[#101b31] rounded-[24px] lg:rounded-[36px] flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border border-[#1e293b]/50 translate-y-8 lg:translate-y-16 lg:-translate-x-12 backdrop-blur-md">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                            <rect x="3" y="10" width="5" height="5" rx="1" />
                            <rect x="15" y="4" width="5" height="5" rx="1" />
                            <rect x="15" y="15" width="5" height="5" rx="1" />
                            <path d="M8 12.5h3.5v-6H15" />
                            <path d="M11.5 12.5v5H15" />
                        </svg>
                    </div>
                </div>

                {/* Text & Controls Container */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-[480px] z-10 lg:order-1 lg:pr-12">

                    {/* Text Content */}
                    <div className="min-h-[140px] lg:min-h-[180px] flex flex-col justify-end lg:justify-center mb-6 w-full">
                        {step < 2 ? (
                            <>
                                <h1
                                    key={`title-${step}`}
                                    className="text-[32px] sm:text-[38px] lg:text-[54px] font-bold tracking-tight text-white leading-[1.1] mb-4 drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500"
                                >
                                    {slides[step].title}
                                </h1>
                                <p
                                    key={`desc-${step}`}
                                    className="text-[#8ba1b7] text-[15px] sm:text-[16px] lg:text-[18px] max-w-[320px] lg:max-w-[400px] leading-[1.6] font-medium mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-3 duration-700"
                                >
                                    {slides[step].description}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-[32px] sm:text-[38px] lg:text-[54px] font-bold tracking-tight text-white leading-[1.1] mb-4 drop-shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    Ready To<br />Begin?
                                </h1>
                                <p className="text-[#8ba1b7] text-[15px] sm:text-[16px] lg:text-[18px] max-w-[320px] lg:max-w-[400px] leading-[1.6] font-medium mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-3 duration-700">
                                    Enter your LeetCode username to instantly generate your dashboard.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex gap-2.5 justify-center lg:justify-start mb-8 z-10 w-full">
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 0 ? "w-8 bg-[#2563eb] shadow-[0_0_10px_#2563eb]" : "w-1.5 bg-[#334155]"}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? "w-8 bg-[#2563eb] shadow-[0_0_10px_#2563eb]" : "w-1.5 bg-[#334155]"}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? "w-8 bg-[#2563eb] shadow-[0_0_10px_#2563eb]" : "w-1.5 bg-[#334155]"}`} />
                    </div>

                    {/* Bottom Action Area */}
                    <div className="w-full z-10">
                        {step < 2 ? (
                            <button
                                onClick={handleNext}
                                className={`w-full lg:w-max px-12 py-4 text-white text-[17px] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                                  ${step === 0 ? "bg-[#2563eb] hover:bg-[#3b82f6] shadow-[0_8px_30px_-5px_#2563eb80]" : ""}
                                  ${step === 1 ? "bg-purple-600 hover:bg-purple-500 shadow-[0_8px_30px_-5px_#9333ea80]" : ""}
                                `}
                            >
                                Next <ArrowRight className="w-5 h-5 stroke-[2.5] ml-2" />
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="w-full lg:w-max px-12 py-4 bg-emerald-600 text-white text-[17px] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-500 shadow-[0_8px_30px_-5px_#05966980] transition-all active:scale-[0.98] animate-in slide-in-from-bottom-4 duration-500"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                </div>

            </div>

        </main>
    );
}
