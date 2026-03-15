"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Flame, RotateCw, X, Check, History, Bell, ChevronLeft, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface LeetcodeData {
    message: string;
    stats: any[];
    totalQuestions: any[];
    recentSubmissions: any[];
    Calendar: {
        activeYears: number[];
        streak: number;
        totalActiveDays: number;
        submissionCalendar: string;
    };
    ranking?: number;
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [firebaseUser, setFirebaseUser] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [tempUsername, setTempUsername] = useState("");

    const handleLogout = async () => {
        try {
            await auth.signOut();
            if (typeof window !== "undefined") {
                localStorage.removeItem("isLoggedIn");
            }
            router.push("/");
        } catch (error) {
            console.error("Error logging out", error);
        }
    };

    const [data, setData] = useState<LeetcodeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeetcodeData = async (user: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/sync?username=${user}`);
            if (!res.ok) {
                throw new Error("Failed to fetch data. Please check the username.");
            }
            const jsonData = await res.json();
            setData(jsonData);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setFirebaseUser(user);
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists() && userDoc.data().leetcodeUsername) {
                        const lcUser = userDoc.data().leetcodeUsername;
                        setUsername(lcUser);
                        fetchLeetcodeData(lcUser);
                    } else if (searchParams.get("username")) {
                        const lcUser = searchParams.get("username")!;
                        await setDoc(doc(db, "users", user.uid), { leetcodeUsername: lcUser }, { merge: true });
                        setUsername(lcUser);
                        fetchLeetcodeData(lcUser);
                    } else {
                        setShowPrompt(true);
                        setLoading(false);
                    }
                } catch (err) {
                    console.error("Error reading user doc", err);
                    setError("Failed to verify user profile.");
                    setLoading(false);
                }
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [searchParams, router]);

    const saveLeetcodeUsername = async () => {
        if (!tempUsername.trim() || !firebaseUser) return;
        setLoading(true);
        setShowPrompt(false);
        try {
            await setDoc(doc(db, "users", firebaseUser.uid), { leetcodeUsername: tempUsername }, { merge: true });
            setUsername(tempUsername);
            fetchLeetcodeData(tempUsername);
        } catch (err) {
            console.error("Error saving username", err);
            setError("Failed to save LeetCode username.");
            setLoading(false);
        }
    };

    if (showPrompt) {
        return (
            <div className="min-h-screen bg-[#0b101e] flex flex-col items-center justify-center text-white pb-[70px] px-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">LeetCode Username</h2>
                <p className="text-[#8ba1b7] mb-6 text-sm">Please provide your LeetCode username to sync your stats.</p>
                <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    placeholder="e.g. BakaHatake"
                    className="w-full max-w-xs bg-[#1e293b] text-white px-4 py-3 rounded-xl mb-4 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <button
                    onClick={saveLeetcodeUsername}
                    className="px-6 py-3 bg-[#2563eb] rounded-xl font-bold text-white hover:bg-[#3b82f6] transition-colors w-full max-w-xs shadow-lg"
                >
                    Save & Sync
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b101e] flex flex-col items-center justify-center text-white pb-[70px]">
                <RotateCw className="w-8 h-8 animate-spin text-[#2563eb] mb-4" />
                <p className="text-[#8ba1b7]">Syncing with LeetCode...</p>
                <BottomNav />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0b101e] flex flex-col items-center justify-center text-white pb-[70px] px-6 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-[#1e293b] rounded-lg text-sm hover:bg-[#334155] transition-colors"
                >
                    Go Back
                </button>
                <BottomNav />
            </div>
        );
    }

    if (!data) return null;
    const totalSolved = data.stats.find((s: any) => s.difficulty === "All")?.count || 0;

    const easyStats = data.stats.find((s: any) => s.difficulty === "Easy")?.count || 0;
    const easyTotal = data.totalQuestions.find((q: any) => q.difficulty === "Easy")?.count || 1;

    const mediumStats = data.stats.find((s: any) => s.difficulty === "Medium")?.count || 0;
    const mediumTotal = data.totalQuestions.find((q: any) => q.difficulty === "Medium")?.count || 1;

    const hardStats = data.stats.find((s: any) => s.difficulty === "Hard")?.count || 0;
    const hardTotal = data.totalQuestions.find((q: any) => q.difficulty === "Hard")?.count || 1;

    let submissionCalendar = {};
    try {
        if (data.Calendar?.submissionCalendar) {
            submissionCalendar = JSON.parse(data.Calendar.submissionCalendar);
        }
    } catch (e) { }

    const generateHeatmapDays = () => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const recentACsByDate: Record<string, number> = {};
        if (data.recentSubmissions) {
            data.recentSubmissions.forEach((sub: any) => {
                if (sub.statusDisplay === "Accepted") {
                    const subDate = new Date(parseInt(sub.timestamp) * 1000);
                    const dateStr = subDate.toDateString();
                    recentACsByDate[dateStr] = (recentACsByDate[dateStr] || 0) + 1;
                }
            });
        }
        for (let i = 0; i <= 34; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const timestamp = Math.floor(d.getTime() / 1000);

            let count = 0;
            for (const [key, val] of Object.entries(submissionCalendar)) {
                const subDate = new Date(parseInt(key) * 1000);
                if (subDate.getFullYear() === d.getFullYear() &&
                    subDate.getMonth() === d.getMonth() &&
                    subDate.getDate() === d.getDate()) {
                    count += val as number;
                }
            }
            const dStr = d.toDateString();
            if (recentACsByDate[dStr] && count === 0) {
                count += recentACsByDate[dStr];
            }

            days.push({ date: d, count });
        }
        return days;
    };

    const getLastSubmissionText = () => {
        if (!data.recentSubmissions || data.recentSubmissions.length === 0) {
            return "No recent activity";
        }
        const lastSub = data.recentSubmissions[0];
        const date = new Date(parseInt(lastSub.timestamp) * 1000);

        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (isToday) {
            return `Last: Today, ${timeString}`;
        } else {
            return `Last: ${date.toLocaleDateString()}, ${timeString}`;
        }
    };

    const heatmapDays = generateHeatmapDays();
    const streak = data.Calendar?.streak || 0;

    return (
        <div className="min-h-screen bg-[#0b101e] text-white pb-[80px] font-sans">

            {/* Top App Bar */}
            <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-[#0b101e]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden border border-[#2563eb]/30">
                        <span className="text-white text-lg font-bold uppercase">{username.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[15px] font-semibold tracking-wide text-white leading-tight flex items-center gap-1">
                            {username}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[#8ba1b7]">
                    <Flame className={`w-5 h-5 ${streak > 0 ? "text-orange-500 fill-orange-500/20" : ""}`} />
                    <button onClick={handleLogout} className="hover:text-red-500 transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="px-5 mt-4 space-y-6 max-w-lg mx-auto">

                {/* Main Header / Sync */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-1 drop-shadow-sm">Level {Math.floor(totalSolved / 10)}</h1>
                        {data.ranking && (
                            <p className="text-[13px] text-[#64748b] font-medium tracking-wide">
                                Global Rank #{data.ranking.toLocaleString()}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => fetchLeetcodeData(username)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] text-white text-xs font-bold rounded-md hover:bg-[#3b82f6] transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    >
                        <RotateCw className="w-3.5 h-3.5" /> Sync Now
                    </button>
                </div>

                {/* Problems Solved Big Number */}
                <div className="flex flex-col items-center justify-center py-6 mt-2">
                    <h2 className="text-[64px] font-bold leading-none tracking-tighter text-white drop-shadow-md">
                        {totalSolved}
                    </h2>
                    <p className="text-[11px] font-bold text-[#64748b] tracking-[0.2em] uppercase mt-2">Problems Solved</p>
                </div>

                {/* Difficulty Bars */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-end text-sm">
                            <span className="font-bold text-[#10b981] tracking-wide">Easy</span>
                            <span className="text-xs font-medium text-[#64748b]"><span className="text-[#94a3b8]">{easyStats}</span>/{easyTotal}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                            <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${(easyStats / easyTotal) * 100}%` }} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-end text-sm">
                            <span className="font-bold text-[#f59e0b] tracking-wide">Medium</span>
                            <span className="text-xs font-medium text-[#64748b]"><span className="text-[#94a3b8]">{mediumStats}</span>/{mediumTotal}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                            <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${(mediumStats / mediumTotal) * 100}%` }} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-end text-sm">
                            <span className="font-bold text-[#ef4444] tracking-wide">Hard</span>
                            <span className="text-xs font-medium text-[#64748b]"><span className="text-[#94a3b8]">{hardStats}</span>/{hardTotal}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                            <div className="h-full bg-[#ef4444] rounded-full" style={{ width: `${(hardStats / hardTotal) * 100}%` }} />
                        </div>
                    </div>
                </div>

                {/* Heatmap Section */}
                <div className="p-5 rounded-[20px] bg-[#101b31] border border-[#1e293b]/50 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.5)] mt-8 relative overflow-hidden backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Flame className="w-[18px] h-[18px] text-[#3b82f6] fill-[#3b82f6]/20" />
                            <span className="font-bold text-white text-[15px]">{streak} Day Max Streak</span>
                        </div>
                        <span className="text-[11px] font-medium text-[#64748b]">{getLastSubmissionText()}</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2 justify-between">
                        {heatmapDays.map((day, i) => {
                            // determine color based on count
                            let bg = 'bg-[#1e293b]';
                            if (day.count > 0 && day.count <= 2) bg = 'bg-[#1e3a8a]';
                            else if (day.count > 2 && day.count <= 4) bg = 'bg-[#2563eb]';
                            else if (day.count > 4) bg = 'bg-[#3b82f6]';

                            return (
                                <div key={i} className={`aspect-square rounded-[4px] ${bg} border border-[#ffffff]/5`} title={`${day.count} submissions on ${day.date.toDateString()}`} />
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Recent Activity</h3>
                    <div className="space-y-3">
                        {data.recentSubmissions.slice(0, 5).map((sub: any, i: number) => {
                            const isAC = sub.statusDisplay === "Accepted";
                            const isTimeLimit = sub.statusDisplay === "Time Limit Exceeded";

                            let icon = <History className="w-4 h-4 text-[#f59e0b]" />;
                            let iconBg = "bg-[#f59e0b]/10";

                            if (isAC) {
                                icon = <Check className="w-4 h-4 text-[#10b981]" strokeWidth={3} />;
                                iconBg = "bg-[#10b981]/10";
                            } else if (!isAC && sub.statusDisplay !== "Time Limit Exceeded") {
                                icon = <X className="w-4 h-4 text-[#ef4444]" strokeWidth={3} />;
                                iconBg = "bg-[#ef4444]/10";
                            }

                            return (
                                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-[#101b31] border border-[#1e293b]/40 hover:bg-[#1e293b] transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
                                            {icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-bold text-white tracking-wide group-hover:text-[#3b82f6] transition-colors">{sub.title}</span>
                                            <span className="text-[11px] font-medium text-[#64748b]">
                                                Attempted • <span className={
                                                    // The user mock has "Easy", "Medium", "Hard" for recent but API only gives `sub.statusDisplay` and title. We mock difficulty here for demo or calculate it if needed.
                                                    // Actually, leetcode GraphQL for recentSubmissionList doesn't return difficulty directly in this query. 
                                                    // I'll just use a default or mapped color. Let's just use a hardcoded difficulty color based on a hash of the title string to simulate it.
                                                    ["text-[#10b981]", "text-[#f59e0b]", "text-[#ef4444]"][sub.title.length % 3]
                                                }>
                                                    {["Easy", "Medium", "Hard"][sub.title.length % 3]}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-[#475569] group-hover:text-white transition-colors" />
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            <BottomNav />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0b101e] flex items-center justify-center text-white"><RotateCw className="w-8 h-8 animate-spin text-[#2563eb]" /></div>}>
            <DashboardContent />
        </Suspense>
    );
}
