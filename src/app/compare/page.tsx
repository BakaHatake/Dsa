"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Search, Flame, Trophy, Activity, RotateCw, AlertCircle, Check, ArrowLeft, History, Calendar, BarChart2 } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import BottomNav from "@/components/BottomNav";

interface UserData {
  username: string;
  realName: string | null;
  ranking: number | null;
  badges: any[] | null;
  activeYears: number[];
  streak: number;
  totalActiveDays: number;
  topicsSolved: any; 
  stats: {
    all: { solved: number; total: number };
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  recentAcSubmissions: any[];
  recentSubmissions: any[];
}

function CompareContent() {
  const router = useRouter();
  
  const [currentUser, setCurrentUser] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [targetUser, setTargetUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [data, setData] = useState<{ user1: UserData; user2: UserData } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().leetcodeUsername) {
            setCurrentUser(userDoc.data().leetcodeUsername);
          } else {
            setError("You need to link your LeetCode username in the Dashboard first.");
          }
        } catch (err) {
          console.error("Error fetching user data", err);
          setError("Failed to verify your profile.");
        }
      } else {
        if (typeof window !== "undefined") {
            localStorage.removeItem("isLoggedIn");
        }
        router.push("/login"); 
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Your LeetCode username is missing. Please set it in the Dashboard.");
      return;
    }
    if (!targetUser.trim()) {
      setError("Please enter a username to compare against.");
      return;
    }
    if (targetUser.toLowerCase() === currentUser.toLowerCase()) {
       setError("You cannot compare your own profile.");
       return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("leetcodeUsername", "==", targetUser.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(`The user '${targetUser}' is not registered on the Platform.`);
      }
      const res = await fetch(`/api/compare?user1=${currentUser}&user2=${targetUser.trim()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch profile analysis from LeetCode.");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#060A14] flex flex-col items-center justify-center text-white">
          <RotateCw className="w-8 h-8 animate-spin text-[#3b82f6] mb-4" />
          <p className="text-slate-400">Authenticating User...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060A14] text-white pb-[100px] font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 sticky top-0 bg-[#060A14]/90 backdrop-blur-xl z-40 border-b border-indigo-900/30 shadow-sm">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Profile Analysis</h1>
      </div>

      <div className="px-4 mt-6 max-w-4xl mx-auto space-y-6">
        
        {/* Search Input Form */}
        <form onSubmit={fetchComparison} className="relative z-10 w-full max-w-4xl mx-auto rounded-[2rem] p-2.5 bg-slate-900/40 border border-slate-700/50 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center gap-2">
            
            {/* User 1 Component */}
            <div className="flex items-center w-full md:w-[40%] bg-[#060A14]/80 rounded-2xl px-5 py-3 md:py-4 border border-slate-800/80">
                <div className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0 mr-3"></div>
                <input type="text" value={currentUser} disabled className="w-full bg-transparent text-slate-300 focus:outline-none text-sm font-medium" />
            </div>
            
            {/* Target Input */}
            <div className="flex items-center w-full md:w-[40%] bg-[#060A14]/80 rounded-2xl px-5 py-3 md:py-4 border border-indigo-900/30 focus-within:border-indigo-500/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mr-3 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                <input type="text" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} placeholder="Target username..." required className="w-full bg-transparent text-white focus:outline-none text-sm font-medium placeholder:text-slate-600" />
            </div>

            <button type="submit" disabled={loading || !currentUser} className="w-full md:w-[20%] py-3 md:py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2 border border-indigo-500/50">
                {loading ? <RotateCw className="w-5 h-5 animate-spin" /> : "Analyze"}
            </button>
            
            {error && (
              <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-3 text-sm text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-2 z-0">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
        </form>

        {/* Display View */}
        {data && (
          <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-700 fade-in fill-mode-both">
            
            {/* User Profiles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 md:p-6 rounded-3xl bg-[#0F172A] border border-slate-800 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#1E293B] flex items-center justify-center text-2xl md:text-3xl font-bold mb-3 md:mb-4 shadow-inner border border-slate-700/50">
                  {data.user1.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-base md:text-lg text-white truncate w-full px-2">{data.user1.realName || data.user1.username}</h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">@{data.user1.username}</p>
                
                {data.user1.badges && data.user1.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4 bg-slate-900/50 py-2 px-3 rounded-xl w-full border border-slate-800/50">
                    {data.user1.badges.slice(0, 4).map((badge, idx) => (
                       <img key={idx} src={badge.icon.startsWith("http") ? badge.icon : `https://leetcode.com${badge.icon}`} alt={badge.displayName} className="w-4 h-4 md:w-5 md:h-5" title={badge.displayName} />
                    ))}
                    {data.user1.badges.length > 4 && <span className="text-[10px] font-bold text-slate-400 ml-1 self-center">+{data.user1.badges.length - 4}</span>}
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6 rounded-3xl bg-[#0F172A] border border-slate-800 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#1E293B] flex items-center justify-center text-2xl md:text-3xl font-bold mb-3 md:mb-4 shadow-inner border border-slate-700/50">
                  {data.user2.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-base md:text-lg text-white truncate w-full px-2">{data.user2.realName || data.user2.username}</h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">@{data.user2.username}</p>
                
                {data.user2.badges && data.user2.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4 bg-slate-900/50 py-2 px-3 rounded-xl w-full border border-slate-800/50">
                    {data.user2.badges.slice(0, 4).map((badge, idx) => (
                       <img key={idx} src={badge.icon.startsWith("http") ? badge.icon : `https://leetcode.com${badge.icon}`} alt={badge.displayName} className="w-4 h-4 md:w-5 md:h-5" title={badge.displayName} />
                    ))}
                    {data.user2.badges.length > 4 && <span className="text-[10px] font-bold text-slate-400 ml-1 self-center">+{data.user2.badges.length - 4}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Core Stats Overview */}
            <div className="bg-[#0F172A] rounded-3xl border border-slate-800 overflow-hidden shadow-lg mt-8">
              <div className="px-5 py-4 border-b border-slate-800 bg-[#141E33] flex items-center justify-between">
                 <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" /> Statistical Overview
                 </h3>
              </div>
              <table className="w-full text-center divide-y divide-slate-800">
                <tbody className="divide-y divide-slate-800">
                   <tr className="bg-[#141E33]/30">
                    <td className="p-5 w-1/3 text-2xl font-bold font-mono text-white">
                      {data.user1.stats.all.solved}
                    </td>
                    <td className="p-5 w-1/3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-[#141E33]/50">
                      Total Solved
                    </td>
                    <td className="p-5 w-1/3 text-2xl font-bold font-mono text-white">
                      {data.user2.stats.all.solved}
                    </td>
                  </tr>

                  <tr className="bg-transparent">
                    <td className="p-4 w-1/3 text-base md:text-lg font-medium text-slate-300">
                      {data.user1.stats.easy.solved}
                    </td>
                    <td className="p-3 w-1/3">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 rounded-lg py-1.5 w-full mx-auto max-w-[100px] border border-emerald-500/20">Easy</div>
                    </td>
                    <td className="p-4 w-1/3 text-base md:text-lg font-medium text-slate-300">
                      {data.user2.stats.easy.solved}
                    </td>
                  </tr>
                  
                   <tr className="bg-transparent">
                    <td className="p-4 w-1/3 text-base md:text-lg font-medium text-slate-300">
                      {data.user1.stats.medium.solved}
                    </td>
                    <td className="p-3 w-1/3">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 rounded-lg py-1.5 w-full mx-auto max-w-[100px] border border-amber-500/20">Medium</div>
                    </td>
                    <td className="p-4 w-1/3 text-base md:text-lg font-medium text-slate-300">
                      {data.user2.stats.medium.solved}
                    </td>
                  </tr>

                  <tr className="bg-transparent">
                    <td className="p-4 w-1/3 text-base md:text-lg font-medium text-slate-300">
                      {data.user1.stats.hard.solved}
                    </td>
                    <td className="p-3 w-1/3">
                        <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 rounded-lg py-1.5 w-full mx-auto max-w-[100px] border border-rose-500/20">Hard</div>
                    </td>
                    <td className="p-4 w-1/3 text-base md:text-lg font-medium text-slate-300">
                      {data.user2.stats.hard.solved}
                    </td>
                  </tr>
                  
                  <tr className="bg-[#141E33]/40 border-t border-slate-700/50">
                    <td className="p-5 w-1/3 font-medium text-lg font-sans tracking-tight text-slate-200">
                      {data.user1.ranking ? `#${data.user1.ranking.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="p-5 w-1/3 text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-[#141E33]/50">
                      Global Rank
                    </td>
                    <td className="p-5 w-1/3 font-medium text-lg font-sans tracking-tight text-slate-200">
                       {data.user2.ranking ? `#${data.user2.ranking.toLocaleString()}` : "N/A"}
                    </td>
                  </tr>

                  <tr className="bg-transparent">
                    <td className="p-4 w-1/3 text-lg font-medium text-slate-300">
                      {data.user1.streak}
                    </td>
                    <td className="p-4 w-1/3 text-[10px] font-bold text-orange-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto">
                      <Flame className="w-3 h-3" /> Max Streak
                    </td>
                    <td className="p-4 w-1/3 text-lg font-medium text-slate-300">
                      {data.user2.streak}
                    </td>
                  </tr>
                  
                   <tr className="bg-transparent">
                    <td className="p-4 w-1/3 text-lg font-medium text-slate-300">
                      {data.user1.totalActiveDays}
                    </td>
                    <td className="p-4 w-1/3 text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto">
                      <Activity className="w-3 h-3" /> Active Days
                    </td>
                    <td className="p-4 w-1/3 text-lg font-medium text-slate-300">
                      {data.user2.totalActiveDays}
                    </td>
                  </tr>

                  <tr className="bg-transparent">
                    <td className="p-4 w-1/3 text-lg font-medium text-slate-300">
                      {data.user1.activeYears?.length || 0}
                    </td>
                    <td className="p-4 w-1/3 text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto">
                      <Calendar className="w-3 h-3" /> Years Active
                    </td>
                    <td className="p-4 w-1/3 text-lg font-medium text-slate-300">
                      {data.user2.activeYears?.length || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Complete Topic Mastery List */}
            {(() => {
                const topicsMap = new Map<string, { u1: number, u2: number, level: string }>();
                
                const processTopics = (user: UserData, key: 'u1'|'u2') => {
                    const levels = ['fundamental', 'intermediate', 'advanced'];
                    levels.forEach(level => {
                        if(user.topicsSolved && user.topicsSolved[level]) {
                            user.topicsSolved[level].forEach((t: any) => {
                                const exist = topicsMap.get(t.tagName) || { u1: 0, u2: 0, level };
                                exist[key] = t.problemsSolved;
                                topicsMap.set(t.tagName, exist);
                            });
                        }
                    });
                };

                processTopics(data.user1, 'u1');
                processTopics(data.user2, 'u2');

                const sortedTopics = Array.from(topicsMap.entries())
                    .map(([name, counts]) => ({ name, ...counts }))
                    .sort((a, b) => (b.u1 + b.u2) - (a.u1 + a.u2)); 

                return (
                    <div className="bg-[#0F172A] rounded-3xl border border-slate-800 overflow-hidden shadow-lg mt-8">
                        <div className="px-5 py-4 border-b border-slate-800 bg-[#141E33] flex items-center justify-between">
                           <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                              <BarChart2 className="w-4 h-4 text-slate-400" /> Topic Breakdown
                           </h3>
                           <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700">{sortedTopics.length} Topics Processed</span>
                        </div>
                        
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#0B1221]">
                            <table className="w-full text-center">
                                <tbody className="divide-y divide-slate-800/30">
                                    {sortedTopics.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-sm text-slate-500 italic font-medium">No topics solved by either profile.</td>
                                        </tr>
                                    )}
                                    {sortedTopics.map((topic, i) => (
                                        <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 w-1/4 text-sm font-medium text-slate-300">
                                                {topic.u1 > 0 ? topic.u1 : <span className="text-slate-700">-</span>}
                                            </td>
                                            <td className="p-4 w-1/2 text-xs font-medium text-slate-300">
                                                {topic.name}
                                                <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">{topic.level}</div>
                                            </td>
                                            <td className="p-4 w-1/4 text-sm font-medium text-slate-300">
                                                {topic.u2 > 0 ? topic.u2 : <span className="text-slate-700">-</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })()}

            {/* Submissions Section */}
            <div className="space-y-8 mt-10 pb-12">
              
              {/* Recent Successes */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                       <Check className="w-5 h-5 text-emerald-500" /> Recent Successes
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* User 1 AC */}
                    <div className="bg-[#0F172A] rounded-2xl border border-slate-800/80 overflow-hidden shadow-md">
                        <div className="p-3 bg-[#141E33] text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 flex items-center gap-3 px-4">
                           <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                           <span className="truncate">@{data.user1.username}</span>
                        </div>
                        <div className="divide-y divide-slate-800/30 max-h-[300px] overflow-y-auto custom-scrollbar">
                           {data.user1.recentAcSubmissions?.map((sub: any, i: number) => (
                             <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-200 truncate w-full">{sub.title}</span>
                             </div>
                           ))}
                           {(!data.user1.recentAcSubmissions || data.user1.recentAcSubmissions.length === 0) && (
                             <div className="p-6 text-xs text-slate-500 text-center italic">No data recorded.</div>
                           )}
                        </div>
                    </div>

                    {/* User 2 AC */}
                    <div className="bg-[#0F172A] rounded-2xl border border-slate-800/80 overflow-hidden shadow-md">
                        <div className="p-3 bg-[#141E33] text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800/50 flex items-center gap-3 px-4">
                           <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                           <span className="truncate">@{data.user2.username}</span>
                        </div>
                        <div className="divide-y divide-slate-800/30 max-h-[300px] overflow-y-auto custom-scrollbar">
                           {data.user2.recentAcSubmissions?.map((sub: any, i: number) => (
                             <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center gap-3">
                                <span className="text-xs font-medium text-slate-200 truncate w-full">{sub.title}</span>
                             </div>
                           ))}
                           {(!data.user2.recentAcSubmissions || data.user2.recentAcSubmissions.length === 0) && (
                             <div className="p-6 text-xs text-slate-500 text-center italic">No data recorded.</div>
                           )}
                        </div>
                    </div>
                  </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                       <History className="w-5 h-5 text-blue-400" /> Recent Activity
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* User 1 All */}
                    <div className="bg-[#0F172A] rounded-2xl border border-slate-800/80 overflow-hidden shadow-md">
                        <div className="p-3 bg-[#141E33] text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 flex items-center gap-3 px-4">
                           <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                           <span className="truncate">@{data.user1.username}</span>
                        </div>
                        <div className="divide-y divide-slate-800/30 max-h-[300px] overflow-y-auto custom-scrollbar">
                           {data.user1.recentSubmissions?.map((sub: any, i: number) => (
                             <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-3">
                                 <span className="text-xs font-medium text-slate-200 truncate">{sub.title}</span>
                                 <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider flex-shrink-0 ${
                                    sub.statusDisplay === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {sub.statusDisplay}
                                  </span>
                             </div>
                           ))}
                           {(!data.user1.recentSubmissions || data.user1.recentSubmissions.length === 0) && (
                             <div className="p-6 text-xs text-slate-500 text-center italic">No data recorded.</div>
                           )}
                        </div>
                    </div>

                    {/* User 2 All */}
                    <div className="bg-[#0F172A] rounded-2xl border border-slate-800/80 overflow-hidden shadow-md">
                        <div className="p-3 bg-[#141E33] text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-slate-800/50 flex items-center gap-3 px-4">
                           <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                           <span className="truncate">@{data.user2.username}</span>
                        </div>
                        <div className="divide-y divide-slate-800/30 max-h-[300px] overflow-y-auto custom-scrollbar">
                           {data.user2.recentSubmissions?.map((sub: any, i: number) => (
                             <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-3">
                                 <span className="text-xs font-medium text-slate-200 truncate">{sub.title}</span>
                                 <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider flex-shrink-0 ${
                                    sub.statusDisplay === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {sub.statusDisplay}
                                  </span>
                             </div>
                           ))}
                           {(!data.user2.recentSubmissions || data.user2.recentSubmissions.length === 0) && (
                             <div className="p-6 text-xs text-slate-500 text-center italic">No data recorded.</div>
                           )}
                        </div>
                    </div>
                  </div>
              </div>

            </div>

          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function ComparePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#060A14] flex items-center justify-center text-white"><RotateCw className="w-8 h-8 animate-spin text-[#3b82f6]" /></div>}>
            <CompareContent />
        </Suspense>
    );
}