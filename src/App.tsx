import { useState, useEffect, useRef, useCallback } from "react";

// ── QUOTES ────────────────────────────────────────────────────────────
const QUOTES = [
{ text: "The secret of getting ahead is getting started.", attr: "Mark Twain" },
{ text: "Small daily improvements are the key to staggering long-term results.", attr: "Unknown" },
{ text: "You don't have to be great to start, but you have to start to be great.", attr: "Zig Ziglar" },
{ text: "An investment in knowledge pays the best interest.", attr: "Benjamin Franklin" },
{ text: "Success is the sum of small efforts, repeated day in and day out.", attr: "Robert Collier" },
{ text: "Doing the best at this moment puts you in the best place for the next moment.", attr: "Oprah Winfrey" },
{ text: "The beautiful thing about learning is that no one can take it away from you.", attr: "B.B. King" },
{ text: "Perseverance is not a long race; it is many short races one after the other.", attr: "Walter Elliot" },
];

const BADGE_DEFS = [
{ id: "first", icon: "🌱", name: "First Bloom", desc: "Complete your first session" },
{ id: "3day", icon: "🌿", name: "3-Day Streak", desc: "Study 3 days in a row" },
{ id: "7day", icon: "🌸", name: "Week Warrior", desc: "Study 7 days in a row" },
{ id: "10h", icon: "⏰", name: "10 Hours", desc: "Study 10 total hours" },
{ id: "night", icon: "🌙", name: "Night Owl", desc: "Study after 9 PM" },
{ id: "early", icon: "🌅", name: "Early Bird", desc: "Study before 8 AM" },
{ id: "5sub", icon: "📚", name: "Scholar", desc: "Study 5 different subjects" },
{ id: "30day", icon: "🏆", name: "Month Master", desc: "30-day streak" },
];

const STREAK_MSGS = [
"Every great student started at day one.",
"Showing up is the hardest part. You did it.",
"Two days in. The habit is forming.",
"Three days of showing up for yourself.",
"Keep going — you're building something real.",
"A whole week? You're really doing this.",
"Look at you, building something beautiful.",
"Your future self is already grateful.",
"Consistency is a superpower. You have it.",
"Imagine where you'll be in a month.",
];

const SUBJECT_COLORS = {
Math: ["#fde8e8", "📐"], English: ["#e8f5e8", "📝"],
Science: ["#e8eeff", "🔬"], History: ["#fff5e8", "📜"],
Spanish: ["#f5e8ff", "🌍"], Biology: ["#e8fff0", "🧬"],
Chemistry: ["#fff0e8", "⚗️"], Physics: ["#e8f0ff", "⚡"],
Art: ["#ffe8f8", "🎨"], Music: ["#f8ffe8", "🎵"],
PE: ["#e8ffee", "🏃"], Other: ["#f0f0f0", "📚"],
};

const THEMES = {
pink: { "--cream":"#fff5f6","--blush":"#f9bfbf","--rose":"#f093a0","--dusty":"#e05070","--text":"#5a1a2a","--textLight":"#b06070","--white":"#fffbfb","--hero":"linear-gradient(135deg,#fde0e8,#fcd8f0)","--blob1":"rgba(240,147,160,0.45)","--blob2":"rgba(230,160,210,0.4)","--navBg":"rgba(255,245,246,0.97)" },
sage: { "--cream":"#f3fdf6","--blush":"#b8ddb8","--rose":"#88c488","--dusty":"#5a9e5a","--text":"#2d4a2d","--textLight":"#6a8a6a","--white":"#ffffff","--hero":"linear-gradient(135deg,#edf9ed,#e0f5e0)","--blob1":"rgba(168,197,160,0.4)","--blob2":"rgba(144,196,144,0.3)","--navBg":"rgba(243,253,246,0.97)" },
lavender: { "--cream":"#f8f3fd","--blush":"#d8c8f0","--rose":"#c0a8e8","--dusty":"#9b78d4","--text":"#3a2d4a","--textLight":"#7a6a8a","--white":"#ffffff","--hero":"linear-gradient(135deg,#f0eafd,#e8e0f8)","--blob1":"rgba(197,184,232,0.4)","--blob2":"rgba(180,160,220,0.3)","--navBg":"rgba(248,243,253,0.97)" },
midnight: { "--cream":"#1a1a2e","--blush":"#3a3a5c","--rose":"#6a6aaa","--dusty":"#9a9ae0","--text":"#e8e8f8","--textLight":"#a8a8c8","--white":"#252540","--hero":"linear-gradient(135deg,#252545,#1e1e3a)","--blob1":"rgba(106,106,170,0.2)","--blob2":"rgba(154,154,224,0.15)","--navBg":"rgba(26,26,46,0.98)" },
peach: { "--cream":"#fff8f3","--blush":"#f5d5b8","--rose":"#f0b48a","--dusty":"#d4845a","--text":"#4a3020","--textLight":"#9a7060","--white":"#ffffff","--hero":"linear-gradient(135deg,#fff3e8,#fde8d0)","--blob1":"rgba(240,180,138,0.35)","--blob2":"rgba(245,200,160,0.3)","--navBg":"rgba(255,248,243,0.97)" },
ocean: { "--cream":"#f0f8fd","--blush":"#a8d8ea","--rose":"#6ab8d8","--dusty":"#3a8aaa","--text":"#1a3a4a","--textLight":"#5a7a8a","--white":"#ffffff","--hero":"linear-gradient(135deg,#e0f4fc,#d0ecf8)","--blob1":"rgba(106,184,216,0.3)","--blob2":"rgba(80,160,200,0.25)","--navBg":"rgba(240,248,253,0.97)" },
rose: { "--cream":"#fdf0f4","--blush":"#f0b8cc","--rose":"#e07898","--dusty":"#c04870","--text":"#4a1a30","--textLight":"#9a5a70","--white":"#ffffff","--hero":"linear-gradient(135deg,#fce8f0,#f8d8e8)","--blob1":"rgba(224,120,152,0.3)","--blob2":"rgba(200,100,140,0.25)","--navBg":"rgba(253,240,244,0.97)" },
sand: { "--cream":"#fdf8ed","--blush":"#e8d8a8","--rose":"#d4b870","--dusty":"#a88840","--text":"#3a2e10","--textLight":"#8a7840","--white":"#ffffff","--hero":"linear-gradient(135deg,#f8f0d8,#f0e4c0)","--blob1":"rgba(212,184,112,0.3)","--blob2":"rgba(200,170,100,0.25)","--navBg":"rgba(253,248,237,0.97)" },
slate: { "--cream":"#2a2e38","--blush":"#4a5068","--rose":"#7a88aa","--dusty":"#a0b0d0","--text":"#e0e8f8","--textLight":"#a0aac0","--white":"#343848","--hero":"linear-gradient(135deg,#343850,#2e3248)","--blob1":"rgba(122,136,170,0.2)","--blob2":"rgba(100,120,160,0.15)","--navBg":"rgba(42,46,56,0.98)" },
mint: { "--cream":"#f0fdf8","--blush":"#a8e8d0","--rose":"#60c8a8","--dusty":"#30a080","--text":"#0a3028","--textLight":"#408870","--white":"#ffffff","--hero":"linear-gradient(135deg,#e0faf0,#d0f4e8)","--blob1":"rgba(96,200,168,0.3)","--blob2":"rgba(70,180,150,0.25)","--navBg":"rgba(240,253,248,0.97)" },
plum: { "--cream":"#f8f0fc","--blush":"#d8a8e8","--rose":"#b878d0","--dusty":"#884898","--text":"#300a40","--textLight":"#885898","--white":"#ffffff","--hero":"linear-gradient(135deg,#f0e0fc,#e8d0f8)","--blob1":"rgba(184,120,208,0.3)","--blob2":"rgba(160,100,188,0.25)","--navBg":"rgba(248,240,252,0.97)" },
ember: { "--cream":"#fdf3f0","--blush":"#f0b8a8","--rose":"#e07858","--dusty":"#c04828","--text":"#3a1008","--textLight":"#9a5040","--white":"#ffffff","--hero":"linear-gradient(135deg,#fce8e0,#f8d8c8)","--blob1":"rgba(224,120,88,0.3)","--blob2":"rgba(200,100,70,0.25)","--navBg":"rgba(253,243,240,0.97)" },
};

const THEME_LABELS = {
pink:"Bloom Pink", sage:"Sage", lavender:"Lavender", midnight:"Midnight",
peach:"Peach", ocean:"Ocean", rose:"Rose", sand:"Sand",
slate:"Slate", mint:"Mint", plum:"Plum", ember:"Ember",
};

const THEME_GRADIENTS = {
pink:"linear-gradient(135deg,#f093a0,#e05070)", sage:"linear-gradient(135deg,#88c488,#5a9e5a)",
lavender:"linear-gradient(135deg,#c0a8e8,#9b78d4)", midnight:"linear-gradient(135deg,#6a6aaa,#3a3a6a)",
peach:"linear-gradient(135deg,#f0b48a,#d4845a)", ocean:"linear-gradient(135deg,#6ab8d8,#3a8aaa)",
rose:"linear-gradient(135deg,#e07898,#c04870)", sand:"linear-gradient(135deg,#d4b870,#a88840)",
slate:"linear-gradient(135deg,#7a88aa,#4a5068)", mint:"linear-gradient(135deg,#60c8a8,#30a080)",
plum:"linear-gradient(135deg,#b878d0,#884898)", ember:"linear-gradient(135deg,#e07858,#c04828)",
};

const ALL_SUBJECTS = ["Math","English","Science","History","Spanish","Biology","Chemistry","Physics","Art","Music","PE","Other"];

const DEFAULT_STATE = {
onboarded: false, name: "", grade: "", streak: 0, bestStreak: 0,
lastStudyDate: null, log: [], badges: [], exams: [], theme: "pink", weekData: {},
settings: {
reminderOn: true, forgivingMode: true,
subjects: ["Math","English","Science","History","Spanish","Other"],
schedule: {
Sun:{on:false,time:"14:00"}, Mon:{on:true,time:"16:30"}, Tue:{on:true,time:"16:30"},
Wed:{on:true,time:"16:30"}, Thu:{on:true,time:"16:30"}, Fri:{on:true,time:"17:00"}, Sat:{on:false,time:"11:00"}
}
}
};

// ── SVG ASSETS ────────────────────────────────────────────────────────
const BloomLogo = ({ size = 90 }) => (
<svg width={size} height={size} viewBox="0 0 90 90" fill="none">
<defs>
<radialGradient id="pG" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#f5c8c8"/><stop offset="100%" stopColor="#d98080"/></radialGradient>
<radialGradient id="cG" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#f5dfa0"/><stop offset="100%" stopColor="#e8b96a"/></radialGradient>
</defs>
<g transform="translate(45,45)">
{[0,72,144,216,288].map(r => <ellipse key={r} cx="0" cy="-18" rx="7" ry="14" fill="url(#pG)" transform={`rotate(${r})`}/>)}
{[36,108,180,252,324].map(r => <ellipse key={r} cx="0" cy="-13" rx="4.5" ry="9" fill="rgba(255,220,220,0.55)" transform={`rotate(${r})`}/>)}
<circle cx="0" cy="0" r="8" fill="url(#cG)"/>
<circle cx="0" cy="0" r="4" fill="rgba(255,248,220,0.8)"/>
</g>
</svg>
);

const HomeIcon = ({ color }) => (
<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
<g transform="translate(13,13)">
{[0,72,144,216,288].map(r=><ellipse key={r} cx="0" cy="-5.5" rx="2.8" ry="5" fill={color} opacity="0.85" transform={`rotate(${r})`}/>)}
<circle cx="0" cy="0" r="3" fill={color}/>
<circle cx="0" cy="0" r="1.4" fill="rgba(255,248,220,0.9)"/>
</g>
</svg>
);
const StudyIcon = ({ color }) => (
<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
<path d="M7 3h12M7 23h12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
<path d="M8 3c0 5 5 7 5 10s-5 5-5 10" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
<path d="M18 3c0 5-5 7-5 10s5 5 5 10" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
<ellipse cx="13" cy="9" rx="2.5" ry="1.5" fill={color} opacity="0.35"/>
</svg>
);
const LogIcon = ({ color }) => (
<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
<rect x="4" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth="1.7"/>
<path d="M4 5a3 3 0 0 1 3-3h13v18h-2" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
<line x1="7.5" y1="9" x2="14.5" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
<line x1="7.5" y1="12.5" x2="14.5" y2="12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
<line x1="7.5" y1="16" x2="11.5" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
</svg>
);
const ProfileIcon = ({ color }) => (
<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
<circle cx="13" cy="9" r="4.5" stroke={color} strokeWidth="1.7"/>
<path d="M4 22c0-4 4-7 9-7s9 3 9 7" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
</svg>
);
const SettingsIcon = ({ color }) => (
<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
<circle cx="13" cy="13" r="3.5" stroke={color} strokeWidth="1.7"/>
{[["13","3","13","6"],["13","20","13","23"],["3","13","6","13"],["20","13","23","13"],["5.9","5.9","8.1","8.1"],["17.9","17.9","20.1","20.1"],["20.1","5.9","17.9","8.1"],["8.1","17.9","5.9","20.1"]].map(([x1,y1,x2,y2],i)=>(
<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
))}
</svg>
);

// ── MAIN APP ──────────────────────────────────────────────────────────
export default function BloomApp() {
const [appState, setAppState] = useState(() => {
try { const s = localStorage.getItem("bloom-state"); return s ? {...DEFAULT_STATE, ...JSON.parse(s)} : {...DEFAULT_STATE}; }
catch { return {...DEFAULT_STATE}; }
});
const [screen, setScreen] = useState("home");
const [showSplash, setShowSplash] = useState(true);
const [splashHide, setSplashHide] = useState(false);
const [toast, setToast] = useState(null);
const [showModal, setShowModal] = useState(false);
const [modalData, setModalData] = useState({});
const [sessionNote, setSessionNote] = useState("");
const [pendingEntry, setPendingEntry] = useState(null);
const [obStep, setObStep] = useState(0);
const [obName, setObName] = useState("");
const [obGrade, setObGrade] = useState("");
const [obSubjects, setObSubjects] = useState(["Math","English","Science","History","Spanish","Other"]);
const [timerRunning, setTimerRunning] = useState(false);
const [timerPhase, setTimerPhase] = useState("focus");
const [timerRemaining, setTimerRemaining] = useState(50*60);
const [timerSession, setTimerSession] = useState(1);
const [totalFocusSecs, setTotalFocusSecs] = useState(0);
const [selectedSubject, setSelectedSubject] = useState(null);
const [timerStarted, setTimerStarted] = useState(false);
const [quote] = useState(() => QUOTES[Math.floor(Math.random()*QUOTES.length)]);
const [themeMenuOpen, setThemeMenuOpen] = useState(false);
const [newSubject, setNewSubject] = useState("");
const [examName, setExamName] = useState("");
const [examDate, setExamDate] = useState("");
const intervalRef = useRef(null);
const t = THEMES[appState.theme] || THEMES.pink;

const save = useCallback((s) => {
try { localStorage.setItem("bloom-state", JSON.stringify(s)); } catch {}
}, []);

// Register service worker for background notifications
useEffect(() => {
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('/sw.js').then(reg => {
console.log('Bloom SW registered');
}).catch(err => console.log('SW error:', err));
}
}, []);

// Send schedule to service worker whenever it changes
useEffect(() => {
if (!appState.settings.reminderOn) return;
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
navigator.serviceWorker.controller.postMessage({
type: 'SCHEDULE_REMINDER',
schedule: appState.settings.schedule
});
}
}, [appState.settings.schedule, appState.settings.reminderOn]);

const updateState = useCallback((updater) => {
setAppState(prev => {
const next = typeof updater === "function" ? updater(prev) : {...prev, ...updater};
save(next);
return next;
});
}, [save]);

const showToast = useCallback((msg) => {
setToast(msg);
setTimeout(() => setToast(null), 2800);
}, []);

// Splash
useEffect(() => {
setTimeout(() => setSplashHide(true), 2400);
setTimeout(() => setShowSplash(false), 3100);
}, []);

// Timer
useEffect(() => {
if (timerRunning) {
intervalRef.current = setInterval(() => {
setTimerRemaining(r => {
if (r <= 1) { handlePhaseEnd(); return 0; }
return r - 1;
});
if (timerPhase === "focus") setTotalFocusSecs(s => s + 1);
}, 1000);
} else clearInterval(intervalRef.current);
return () => clearInterval(intervalRef.current);
}, [timerRunning, timerPhase]);

const handlePhaseEnd = useCallback(() => {
setTimerRunning(false);
setTimerPhase(phase => {
if (phase === "focus") {
setTimerSession(sess => {
if (sess >= 3) { setTimeout(() => completeSession(), 100); return sess; }
setTimerRemaining(10*60);
showToast("🌿 Break time! Step away & breathe.");
return sess;
});
return "break";
} else {
setTimerSession(sess => { setTimerRemaining(50*60); showToast("📚 Back to focus!"); return sess + 1; });
return "focus";
}
});
}, []);

const completeSession = useCallback(() => {
const mins = Math.round(totalFocusSecs / 60);
const hour = new Date().getHours();
const entry = { id: Date.now(), date: new Date().toISOString(), subject: selectedSubject, duration: mins, sessions: timerSession, note: "", hour };
updateState(prev => {
const newLog = [entry, ...prev.log];
const todayStr = new Date().toDateString();
const alreadyToday = prev.log.some(s => new Date(s.date).toDateString() === todayStr);
let streak = prev.streak, bestStreak = prev.bestStreak, lastStudyDate = prev.lastStudyDate;
if (!alreadyToday) {
const last = lastStudyDate ? new Date(lastStudyDate) : null;
const diff = last ? Math.floor((new Date() - last) / (1000*60*60*24)) : 999;
streak = diff <= 2 ? streak + 1 : 1;
if (streak > bestStreak) bestStreak = streak;
lastStudyDate = new Date().toISOString();
}
// badges
const badges = [...prev.badges];
const earn = (id) => { if (!badges.includes(id)) { badges.push(id); setTimeout(() => showToast("Badge unlocked: " + BADGE_DEFS.find(b=>b.id===id).name + " " + BADGE_DEFS.find(b=>b.id===id).icon), 1000); }};
if (newLog.length >= 1) earn("first");
if (streak >= 3) earn("3day");
if (streak >= 7) earn("7day");
if (streak >= 30) earn("30day");
const totalMins = newLog.reduce((a,s)=>a+s.duration,0);
if (totalMins >= 600) earn("10h");
if (hour >= 21) earn("night");
if (hour < 8) earn("early");
if (new Set(newLog.map(s=>s.subject)).size >= 5) earn("5sub");
return { ...prev, log: newLog, streak, bestStreak, lastStudyDate, badges };
});
setPendingEntry(entry);
const msgs = ["You showed up for yourself today. That's everything.", "Future you is saying thank you.", "One more bloom added to your garden.", "That focus? That's a skill you're building.", `${mins} minutes of your future, invested wisely.`];
setModalData({ duration: mins, subject: selectedSubject, msg: msgs[Math.floor(Math.random()*msgs.length)] });
setSessionNote("");
setShowModal(true);
resetTimer();
}, [totalFocusSecs, selectedSubject, timerSession, updateState, showToast]);

const resetTimer = () => {
clearInterval(intervalRef.current);
setTimerRunning(false); setTimerPhase("focus"); setTimerRemaining(50*60);
setTimerSession(1); setTotalFocusSecs(0); setTimerStarted(false);
};

const closeModal = () => {
if (pendingEntry) {
updateState(prev => ({ ...prev, log: prev.log.map(e => e.id === pendingEntry.id ? {...e, note: sessionNote} : e) }));
}
setShowModal(false); setScreen("home");
};

const CIRC = 2 * Math.PI * 100;
const total = timerPhase === "focus" ? 50*60 : 10*60;
const progress = timerRemaining / total;
const offset = CIRC * (1 - progress);
const mins = String(Math.floor(timerRemaining/60)).padStart(2,"0");
const secs = String(timerRemaining%60).padStart(2,"0");

// Onboarding
const obNext = () => {
if (obStep === 1 && !obName.trim()) { showToast("Enter your name first 🌸"); return; }
if (obStep === 2 && !obGrade) { showToast("Pick your grade 🌸"); return; }
if (obStep < 3) setObStep(s => s+1);
};
const obFinish = () => {
updateState(prev => ({ ...prev, onboarded: true, name: obName.trim(), grade: obGrade, settings: { ...prev.settings, subjects: obSubjects.length ? obSubjects : ["Math","English","Other"] }}));
};

// Week row
const weekDays = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const weekDots = Array.from({length:7},(_,i) => {
const d = new Date(); d.setDate(d.getDate()-(6-i));
const key = d.toDateString();
const has = appState.log.some(s => new Date(s.date).toDateString() === key);
return { label: weekDays[d.getDay()], has, isToday: i===6 };
});

const weekSessions = appState.log.filter(s => { const ago=new Date(); ago.setDate(ago.getDate()-7); return new Date(s.date)>=ago; });
const weekMins = weekSessions.reduce((a,s)=>a+s.duration,0);

// Subject chart
const now = new Date();
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const monthSessions = appState.log.filter(s => new Date(s.date) >= monthStart);
const subjectTotals = {};
monthSessions.forEach(s => { subjectTotals[s.subject] = (subjectTotals[s.subject]||0)+s.duration; });
const chartData = Object.entries(subjectTotals).sort((a,b)=>b[1]-a[1]).slice(0,5);
const chartMax = chartData[0]?chartData[0][1]:1;

// Exam
const upcomingExams = appState.exams.filter(e => new Date(e.date) >= new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date));
const nextExam = upcomingExams[0];
const nextExamDays = nextExam ? Math.ceil((new Date(nextExam.date)-new Date())/(1000*60*60*24)) : null;

// Monthly recap
const lastMonthStart = new Date(now.getFullYear(), now.getMonth()-1, 1);
const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
const lastMonthSessions = appState.log.filter(s => { const d=new Date(s.date); return d>=lastMonthStart&&d<=lastMonthEnd; });
const showRecap = now.getDate() <= 3 && lastMonthSessions.length > 0;

const cs = { // computed styles shorthand
cream: t["--cream"], dusty: t["--dusty"], rose: t["--rose"], blush: t["--blush"],
text: t["--text"], textLight: t["--textLight"], white: t["--white"],
hero: t["--hero"], navBg: t["--navBg"],
};

const card = { background: cs.white, borderRadius: 24, padding: 20, marginBottom: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", border: `1px solid ${cs.blush}33` };
const btn = { background: `linear-gradient(135deg,${cs.rose},${cs.dusty})`, color:"white", border:"none", borderRadius:50, padding:"14px 32px", fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:"pointer" };
const chipStyle = (active) => ({ padding:"8px 14px", borderRadius:50, background: active?`linear-gradient(135deg,${cs.blush}88,${cs.rose}44)`:cs.cream, color: active?cs.dusty:cs.textLight, border:`2px solid ${active?cs.blush:"transparent"}`, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" });
const inputStyle = { border:`2px solid ${cs.blush}`, borderRadius:12, padding:"10px 14px", fontFamily:"inherit", fontSize:14, color:cs.text, background:cs.white, outline:"none", width:"100%" };
const toggleStyle = (on) => ({ width:48, height:26, background: on?`linear-gradient(135deg,${cs.rose},${cs.dusty})`:"#ccc", borderRadius:50, position:"relative", cursor:"pointer", transition:"background 0.3s", flexShrink:0 });
const toggleKnob = (on) => ({ position:"absolute", width:20, height:20, borderRadius:"50%", background:"white", top:3, left: on?25:3, transition:"left 0.3s", boxShadow:"0 2px 6px rgba(0,0,0,0.15)" });

// Splash screen
if (showSplash) return (
<div style={{ position:"fixed",inset:0,background:`linear-gradient(160deg,${cs.cream},#fdf8f3,#f5f0fd)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999,opacity:splashHide?0:1,transform:splashHide?"scale(1.04)":"scale(1)",transition:"opacity 0.7s ease,transform 0.7s ease" }}>
<div style={{ display:"flex",flexDirection:"column",alignItems:"center",animation:"splashPop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}>
<div style={{ marginBottom:16,filter:`drop-shadow(0 8px 28px rgba(201,123,123,0.28))` }}><BloomLogo size={90}/></div>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:58,color:cs.dusty,lineHeight:1 }}>bloom</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:15,color:cs.textLight,marginTop:10 }}>small sessions. big futures.</div>
</div>
<div style={{ display:"flex",gap:8,marginTop:52 }}>
{["#f2c4c4","#e8a0a0","#c5b8e8"].map((c,i)=>(
<div key={i} style={{ width:8,height:8,borderRadius:"50%",background:c,animation:`dotPulse 1.4s ${i*0.2}s ease-in-out infinite` }}/>
))}
</div>
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@400;500;600;700&display=swap');
@keyframes dotPulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.5);opacity:1}}
@keyframes splashPop{from{opacity:0;transform:scale(0.7) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes flowerSpin{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.06)}}
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Quicksand', sans-serif; }
`}</style>
</div>
);

// Onboarding
if (!appState.onboarded) return (
<div style={{ minHeight:"100vh",background:cs.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px" }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;font-family:'Quicksand',sans-serif;}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes flowerSpin{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.06)}}`}</style>
<div style={{ width:"100%",maxWidth:360,textAlign:"center",animation:"fadeUp 0.4s ease" }}>
{obStep===0 && <>
<div style={{ marginBottom:20,animation:"flowerSpin 6s ease-in-out infinite",display:"inline-block" }}><BloomLogo size={70}/></div>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:42,color:cs.dusty,marginBottom:8 }}>welcome to bloom</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:16,color:cs.textLight,marginBottom:32,lineHeight:1.6 }}>Your personal study companion.<br/>Let's get you set up.</div>
<button style={{...btn,width:"100%",padding:16,borderRadius:18,fontSize:16}} onClick={obNext}>Let's go →</button>
</>}
{obStep===1 && <>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:42,color:cs.dusty,marginBottom:8 }}>what's your name?</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:15,color:cs.textLight,marginBottom:24 }}>We'll use it to make things feel a little more yours.</div>
<input style={{...inputStyle,textAlign:"center",fontSize:16,padding:"14px",marginBottom:16,borderRadius:16}} placeholder="Your first name" value={obName} onChange={e=>setObName(e.target.value)} maxLength={24}/>
<button style={{...btn,width:"100%",padding:16,borderRadius:18,fontSize:16}} onClick={obNext}>Next →</button>
</>}
{obStep===2 && <>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:42,color:cs.dusty,marginBottom:8 }}>what grade?</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:15,color:cs.textLight,marginBottom:24 }}>We'll tailor your experience.</div>
<div style={{ display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24 }}>
{["8th","9th","10th","11th","12th","College"].map(g=>(
<button key={g} style={chipStyle(obGrade===g)} onClick={()=>setObGrade(g)}>{g}</button>
))}
</div>
<button style={{...btn,width:"100%",padding:16,borderRadius:18,fontSize:16}} onClick={obNext}>Next →</button>
</>}
{obStep===3 && <>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:42,color:cs.dusty,marginBottom:8 }}>your subjects</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:15,color:cs.textLight,marginBottom:20 }}>Tap to select. Change anytime.</div>
<div style={{ display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:24 }}>
{ALL_SUBJECTS.map(s=>(
<button key={s} style={chipStyle(obSubjects.includes(s))} onClick={()=>setObSubjects(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s])}>{s}</button>
))}
</div>
<button style={{...btn,width:"100%",padding:16,borderRadius:18,fontSize:16}} onClick={obFinish}>Start Blooming 🌸</button>
</>}
<div style={{ display:"flex",gap:8,justifyContent:"center",marginTop:24 }}>
{[0,1,2,3].map(i=>(
<div key={i} style={{ width:8,height:8,borderRadius:"50%",background:i===obStep?cs.dusty:cs.blush,transform:i===obStep?"scale(1.3)":"scale(1)",transition:"all 0.3s" }}/>
))}
</div>
</div>
</div>
);

const navItems = [
{ id:"home", label:"Home", Icon:HomeIcon },
{ id:"timer", label:"Study", Icon:StudyIcon },
{ id:"log", label:"Log", Icon:LogIcon },
{ id:"profile", label:"Profile", Icon:ProfileIcon },
{ id:"settings",label:"Settings", Icon:SettingsIcon },
];

return (
<div style={{ background:cs.cream,minHeight:"100vh",maxWidth:420,margin:"0 auto",position:"relative",paddingBottom:90,color:cs.text,transition:"background 0.4s",boxShadow:"none" }}>
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;font-family:'Quicksand',sans-serif;}
html,body,#root{background:transparent !important;min-height:100vh;}
body{background:transparent !important;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes flowerSpin{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.06)}}
@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
input,textarea,select{font-family:'Quicksand',sans-serif;}
textarea{resize:none;}
button:active{opacity:0.85;}
`}</style>

{/* TOAST */}
{toast && <div style={{ position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:cs.text,color:cs.white,padding:"12px 24px",borderRadius:50,fontSize:14,fontWeight:600,zIndex:300,whiteSpace:"nowrap",animation:"fadeUp 0.3s ease" }}>{toast}</div>}

{/* MODAL */}
{showModal && (
<div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
<div style={{ background:cs.white,borderRadius:28,padding:32,width:"100%",maxWidth:360,textAlign:"center",animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
<div style={{ fontSize:52,marginBottom:12 }}>🌸</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:24,color:cs.text,marginBottom:8 }}>Session Complete!</div>
<div style={{ fontSize:14,color:cs.textLight,marginBottom:20,lineHeight:1.6 }}>{modalData.msg}</div>
<div style={{ display:"flex",gap:12,marginBottom:16 }}>
{[{val:modalData.duration,label:"Minutes"},{val:modalData.subject,label:"Subject"}].map(({val,label})=>(
<div key={label} style={{ flex:1,background:cs.cream,borderRadius:16,padding:14,textAlign:"center" }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:600,color:cs.dusty }}>{val}</div>
<div style={{ fontSize:11,color:cs.textLight,fontWeight:700,textTransform:"uppercase" }}>{label}</div>
</div>
))}
</div>
<textarea style={{...inputStyle,marginBottom:16,borderRadius:14,lineHeight:1.5}} rows={2} placeholder="One thing you learned... (optional)" value={sessionNote} onChange={e=>setSessionNote(e.target.value)}/>
<button style={{...btn,width:"100%",padding:16,borderRadius:18,fontSize:16}} onClick={closeModal}>Keep Blooming 🌿</button>
</div>
</div>
)}

{/* HOME */}
{screen==="home" && (
<div style={{ padding:"0 20px",animation:"fadeUp 0.4s ease" }}>
<div style={{ padding:"52px 0 20px",textAlign:"center" }}>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:38,color:cs.dusty }}>bloom</div>
<div style={{ fontSize:13,color:cs.textLight,marginTop:4 }}>small sessions. big futures.</div>
</div>
{/* Streak hero */}
<div style={{ background:cs.hero,borderRadius:28,padding:"28px 24px",textAlign:"center",marginBottom:16,border:`1px solid ${cs.blush}44`,position:"relative",overflow:"hidden" }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:72,fontWeight:600,color:cs.dusty,lineHeight:1 }}>{appState.streak}</div>
<div style={{ fontSize:14,color:cs.textLight,marginTop:4,fontWeight:600,letterSpacing:1,textTransform:"uppercase",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
<svg width="16" height="16" viewBox="0 0 90 90" fill="none"><g transform="translate(45,45)">{[0,72,144,216,288].map(r=><ellipse key={r} cx="0" cy="-18" rx="7" ry="14" fill={cs.dusty} opacity="0.9" transform={`rotate(${r})`}/>)}<circle cx="0" cy="0" r="8" fill="#f5dfa0"/><circle cx="0" cy="0" r="4" fill="rgba(255,248,220,0.9)"/></g></svg>
Day Streak
</div>
<div style={{ marginTop:12,fontSize:14,color:cs.text,fontStyle:"italic",fontFamily:"'Playfair Display',serif",lineHeight:1.5 }}>{STREAK_MSGS[Math.min(appState.streak,STREAK_MSGS.length-1)]}</div>
</div>
{/* Stats */}
<div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16 }}>
{[{val:(weekMins/60).toFixed(1)+"h",label:"This Week"},{val:weekSessions.length,label:"Sessions"}].map(({val,label})=>(
<div key={label} style={{...card,margin:0,textAlign:"center",padding:18}}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:600,color:cs.dusty }}>{val}</div>
<div style={{ fontSize:11,color:cs.textLight,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginTop:2 }}>{label}</div>
</div>
))}
</div>
{/* Week dots */}
<div style={card}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:cs.text,marginBottom:16 }}>This Week</div>
<div style={{ display:"flex",justifyContent:"space-between" }}>
{weekDots.map((d,i)=>(
<div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
<div style={{ width:32,height:32,borderRadius:"50%",background:d.has?`linear-gradient(135deg,${cs.rose},${cs.blush})`:"#f0e8e8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:d.isToday?`0 0 0 3px ${cs.dusty}`:"none",transition:"all 0.3s" }}>{d.has?"✓":""}</div>
<div style={{ fontSize:10,color:cs.textLight,fontWeight:700 }}>{d.label}</div>
</div>
))}
</div>
</div>
{/* Exam countdown */}
{nextExam && (
<div style={{ background:"linear-gradient(135deg,#fff8ed,#fff0e0)",borderRadius:20,padding:"16px 20px",marginBottom:16,border:"1px solid rgba(232,169,106,0.3)",display:"flex",alignItems:"center",gap:14 }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:600,color:"#c47a2a",minWidth:48,textAlign:"center" }}>{nextExamDays}</div>
<div>
<div style={{ fontWeight:700,fontSize:15,color:cs.text }}>{nextExam.name}</div>
<div style={{ fontSize:12,color:cs.textLight,marginTop:2 }}>days away</div>
</div>
</div>
)}
{/* Nudge */}
{weekSessions.length > 0 && (() => {
const top = weekSessions.reduce((a,s)=>{a[s.subject]=(a[s.subject]||0)+1;return a;},{});
const topSub = Object.entries(top).sort((a,b)=>b[1]-a[1])[0][0];
return (
<div style={{ background:"linear-gradient(135deg,#f9f0ff,#f5eeff)",borderRadius:20,padding:18,border:"1px solid rgba(197,184,232,0.4)",marginBottom:16 }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:14,color:"#9b78d4",lineHeight:1.6 }}>✨ You've studied {(weekMins/60).toFixed(1)} hours this week — mostly {topSub}. That's {weekSessions.length} session{weekSessions.length>1?"s":""} of showing up for your future self.</div>
</div>
);
})()}
{/* Monthly recap */}
{showRecap && (() => {
const totalMins = lastMonthSessions.reduce((a,s)=>a+s.duration,0);
const subs = [...new Set(lastMonthSessions.map(s=>s.subject))];
const dayCount = {};
lastMonthSessions.forEach(s=>{const d=new Date(s.date).toDateString();dayCount[d]=(dayCount[d]||0)+s.duration;});
const bestDay = Object.entries(dayCount).sort((a,b)=>b[1]-a[1])[0];
const bestDayName = bestDay ? new Date(bestDay[0]).toLocaleDateString("en-US",{weekday:"long"}) : "";
const monthName = lastMonthStart.toLocaleDateString("en-US",{month:"long"});
return (
<div style={{ background:"linear-gradient(135deg,#f5eeff,#ede5ff)",borderRadius:24,padding:22,marginBottom:16,border:"1px solid rgba(197,184,232,0.4)" }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:"#9b78d4",marginBottom:6 }}>📊 {monthName} Recap</div>
<div style={{ fontSize:14,color:cs.text,lineHeight:1.7 }}>In {monthName} you studied <strong>{(totalMins/60).toFixed(1)} hours</strong> across <strong>{subs.length} subject{subs.length>1?"s":""}</strong>. Your best day was <strong>{bestDayName}</strong>. Keep that momentum. 🌸</div>
</div>
);
})()}
<button style={{...btn,width:"100%",padding:18,borderRadius:20,fontSize:17,marginBottom:16}} onClick={()=>setScreen("timer")}>
Start Studying
</button>
</div>
)}

{/* TIMER */}
{screen==="timer" && (
<div style={{ padding:"0 20px",animation:"fadeUp 0.4s ease" }}>
<div style={{ padding:"52px 0 16px",textAlign:"center" }}>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:38,color:cs.dusty }}>bloom</div>
</div>
{/* Quote */}
<div style={{ background:cs.hero,borderRadius:16,padding:"16px 18px",marginBottom:16,border:`1px solid ${cs.blush}33` }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:14,color:cs.text,lineHeight:1.6 }}>"{quote.text}"</div>
<div style={{ fontSize:11,color:cs.textLight,marginTop:6,fontWeight:600 }}>— {quote.attr}</div>
</div>
{/* Subject */}
<div style={{ marginBottom:16 }}>
<div style={{ fontSize:13,fontWeight:700,color:cs.textLight,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10 }}>What are you studying?</div>
<div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
{appState.settings.subjects.map(s=>(
<button key={s} style={chipStyle(selectedSubject===s)} onClick={()=>setSelectedSubject(s)}>{s}</button>
))}
</div>
</div>
{/* Session plan */}
<div style={{ background:appState.theme==="midnight"?"#2e2e50":"#f9f5ff",borderRadius:16,padding:16,marginBottom:16 }}>
<div style={{ fontSize:12,fontWeight:700,color:appState.theme==="midnight"?"#b0a8e8":"#9b78d4",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10 }}>📋 Session Plan</div>
{[["focus","50 min — Deep Focus"],["brk","10 min — Rest"],["focus","50 min — Deep Focus"],["brk","10 min — Rest"],["focus","50 min — Focus (optional)"]].map(([type,label],i)=>(
<div key={i} style={{ display:"flex",alignItems:"center",gap:8,fontSize:13,color:appState.theme==="midnight"?"#d0d0f0":cs.text,marginBottom:6 }}>
<div style={{ width:8,height:8,borderRadius:"50%",background:type==="focus"?cs.rose:"#a8c5a0",flexShrink:0 }}/>
{label}
</div>
))}
</div>
{/* Timer ring */}
<div style={{ textAlign:"center",padding:"8px 0 16px" }}>
<div style={{ fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:2,color:timerPhase==="focus"?cs.dusty:"#5a9e5a",marginBottom:8 }}>
{timerPhase==="focus"
? <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
<svg width="14" height="14" viewBox="0 0 90 90" fill="none"><g transform="translate(45,45)">{[0,72,144,216,288].map(r=><ellipse key={r} cx="0" cy="-18" rx="7" ry="14" fill={cs.dusty} opacity="0.9" transform={`rotate(${r})`}/>)}<circle cx="0" cy="0" r="8" fill="#f5dfa0"/><circle cx="0" cy="0" r="4" fill="rgba(255,248,220,0.9)"/></g></svg>
Focus Time
</span>
: <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="22" x2="12" y2="10" stroke="#5a9e5a" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 17 C12 13 8 10 5 11 C5 14 8 17 12 17Z" fill="#7a9e72" opacity="0.95"/><path d="M12 17 C12 13 16 10 19 11 C19 14 16 17 12 17Z" fill="#7a9e72" opacity="0.95"/><path d="M12 12 C12 9 10 6 12 4 C14 6 12 9 12 12Z" fill="#7a9e72" opacity="0.88"/></svg>
Break Time
</span>}
</div>
<div style={{ position:"relative",width:220,height:220,margin:"0 auto 20px",filter:"drop-shadow(0 6px 18px rgba(201,123,123,0.2))" }}>
<svg width="220" height="220" viewBox="0 0 220 220" style={{ transform:"rotate(-90deg)" }}>
<defs>
<linearGradient id="fG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={cs.rose}/><stop offset="100%" stopColor={cs.dusty}/></linearGradient>
<linearGradient id="bG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a8c5a0"/><stop offset="100%" stopColor="#7a9e72"/></linearGradient>
</defs>
<circle cx="110" cy="110" r="100" fill="none" stroke="rgba(201,123,123,0.1)" strokeWidth="24" strokeDasharray="3 12" strokeLinecap="butt"/>
<circle cx="110" cy="110" r="100" fill="none" stroke="#f0e6e6" strokeWidth="14"/>
<circle cx="110" cy="110" r="100" fill="none" stroke={`url(#${timerPhase==="focus"?"fG":"bG"})`} strokeWidth="14" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset} style={{ transition:"stroke-dashoffset 1s linear",filter:`drop-shadow(0 0 5px ${timerPhase==="focus"?"rgba(201,123,123,0.45)":"rgba(122,158,114,0.45)"}` }}/>
</svg>
<div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center" }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:600,color:cs.text,lineHeight:1 }}>{mins}:{secs}</div>
<div style={{ fontSize:12,color:cs.textLight,marginTop:4,fontWeight:600 }}>Session {timerSession} of 3</div>
</div>
</div>
<div style={{ display:"flex",gap:12,justifyContent:"center" }}>
<button style={{ padding:"14px 24px",background:cs.cream,color:cs.dusty,border:"none",borderRadius:50,fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:"pointer" }} onClick={resetTimer}>Reset</button>
<button style={{...btn,padding:"14px 36px"}} onClick={()=>{
if(!selectedSubject){showToast("Pick a subject first 📚");return;}
setTimerRunning(r=>!r);
setTimerStarted(true);
}}>{timerRunning?"Pause":"Start"}</button>
</div>
</div>
</div>
)}

{/* LOG */}
{screen==="log" && (
<div style={{ padding:"0 20px",animation:"fadeUp 0.4s ease" }}>
<div style={{ padding:"52px 0 20px",textAlign:"center" }}>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:38,color:cs.dusty }}>bloom</div>
<div style={{ fontSize:13,color:cs.textLight,marginTop:4 }}>your study history</div>
</div>
{appState.log.length===0
? <div style={{ textAlign:"center",padding:"40px 20px",color:cs.textLight,fontStyle:"italic",fontFamily:"'Playfair Display',serif",fontSize:16 }}>No sessions yet.<br/>Start studying to see your history bloom. <svg style={{display:"inline",verticalAlign:"middle",marginLeft:4}} width="16" height="16" viewBox="0 0 90 90" fill="none"><g transform="translate(45,45)">{[0,72,144,216,288].map(r=><ellipse key={r} cx="0" cy="-18" rx="7" ry="14" fill="#c97b7b" opacity="0.85" transform={`rotate(${r})`}/>)}<circle cx="0" cy="0" r="8" fill="#f5dfa0"/><circle cx="0" cy="0" r="4" fill="rgba(255,248,220,0.9)"/></g></svg></div>
: appState.log.map(entry=>{
const col = SUBJECT_COLORS[entry.subject]||SUBJECT_COLORS.Other;
const dateStr = new Date(entry.date).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
return (
<div key={entry.id} style={{...card,animation:"fadeUp 0.3s ease"}}>
<div style={{ display:"flex",alignItems:"center",gap:16 }}>
<div style={{ width:44,height:44,borderRadius:14,background:col[0],display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{col[1]}</div>
<div style={{ flex:1 }}>
<div style={{ fontWeight:700,fontSize:15,color:cs.text }}>{entry.subject}</div>
<div style={{ fontSize:12,color:cs.textLight,marginTop:2 }}>{dateStr} · {entry.sessions} session{entry.sessions>1?"s":""}</div>
</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,color:cs.dusty }}>{entry.duration}m</div>
</div>
{entry.note && <div style={{ marginTop:10,paddingTop:10,borderTop:`1px solid ${cs.blush}44`,fontSize:13,color:cs.textLight,fontStyle:"italic",lineHeight:1.5 }}>💭 {entry.note}</div>}
</div>
);
})}
</div>
)}

{/* PROFILE */}
{screen==="profile" && (
<div style={{ padding:"0 20px",animation:"fadeUp 0.4s ease" }}>
<div style={{ padding:"52px 0 20px",textAlign:"center" }}>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:38,color:cs.dusty }}>bloom</div>
<div style={{ fontSize:13,color:cs.textLight,marginTop:4 }}>your journey</div>
</div>
{/* Profile hero */}
<div style={{ background:cs.hero,borderRadius:28,padding:"24px",textAlign:"center",marginBottom:16 }}>
<div style={{ width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${cs.rose},${cs.dusty})`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontFamily:"'Dancing Script',cursive",fontSize:32,color:"white" }}>{(appState.name||"B")[0].toUpperCase()}</div>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:24,color:cs.text }}>{appState.name||"Bloomer"}</div>
<div style={{ fontSize:13,color:cs.textLight,marginTop:4 }}>{appState.grade}</div>
</div>
{/* Records */}
<div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16 }}>
{[{val:appState.bestStreak,label:"Best Streak"},{val:(appState.log.reduce((a,s)=>a+s.duration,0)/60).toFixed(1)+"h",label:"Total Hours"},{val:appState.log.length,label:"Sessions"}].map(({val,label})=>(
<div key={label} style={{...card,margin:0,padding:14,textAlign:"center"}}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:cs.dusty }}>{val}</div>
<div style={{ fontSize:10,color:cs.textLight,fontWeight:700,textTransform:"uppercase",marginTop:2,lineHeight:1.3 }}>{label}</div>
</div>
))}
</div>
{/* Chart */}
<div style={card}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:cs.text,marginBottom:16 }}>Subjects This Month</div>
{chartData.length===0
? <div style={{ fontSize:13,color:cs.textLight,fontStyle:"italic" }}>No sessions this month yet.</div>
: chartData.map(([sub,mins])=>(
<div key={sub} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
<div style={{ fontSize:12,fontWeight:700,color:cs.textLight,width:58,flexShrink:0,textAlign:"right" }}>{sub.substring(0,7)}</div>
<div style={{ flex:1,height:18,background:"#f0e8e8",borderRadius:50,overflow:"hidden" }}>
<div style={{ width:`${(mins/chartMax*100).toFixed(0)}%`,height:"100%",background:`linear-gradient(90deg,${cs.rose},${cs.dusty})`,borderRadius:50,transition:"width 0.8s ease" }}/>
</div>
<div style={{ fontSize:12,fontWeight:700,color:cs.dusty,width:32,flexShrink:0 }}>{mins}m</div>
</div>
))}
</div>
{/* Badges */}
<div style={card}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:cs.text,marginBottom:16 }}>Badges</div>
<div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
{BADGE_DEFS.map(b=>{
const earned = appState.badges.includes(b.id);
return (
<div key={b.id} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
<div title={b.desc} style={{ width:52,height:52,borderRadius:"50%",background:earned?`linear-gradient(135deg,${cs.rose},${cs.dusty})`:"#f0e8e8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:earned?`0 4px 12px rgba(201,123,123,0.3)`:"none",filter:earned?"none":"grayscale(1)",opacity:earned?1:0.45,transition:"all 0.3s" }}>{b.icon}</div>
<div style={{ fontSize:10,color:cs.textLight,fontWeight:700,textAlign:"center",lineHeight:1.3 }}>{b.name}</div>
</div>
);
})}
</div>
</div>
{/* Exams */}
<div style={card}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,color:cs.text,marginBottom:12 }}>Exam Countdown</div>
{appState.exams.length===0
? <div style={{ fontSize:13,color:cs.textLight,fontStyle:"italic",marginBottom:12 }}>No exams added yet.</div>
: appState.exams.sort((a,b)=>new Date(a.date)-new Date(b.date)).map((e,i)=>{
const days = Math.ceil((new Date(e.date)-new Date())/(1000*60*60*24));
const past = days < 0;
return (
<div key={i} style={{ background:"linear-gradient(135deg,#fff8ed,#fff0e0)",borderRadius:16,padding:"14px 16px",marginBottom:10,border:"1px solid rgba(232,169,106,0.25)",display:"flex",alignItems:"center",gap:12,opacity:past?0.5:1 }}>
<div style={{ fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:600,color:past?cs.textLight:"#c47a2a",minWidth:44,textAlign:"center" }}>{past?"✓":days}</div>
<div style={{ flex:1 }}>
<div style={{ fontWeight:700,fontSize:14,color:cs.text }}>{e.name}</div>
<div style={{ fontSize:12,color:cs.textLight,marginTop:2 }}>{past?"completed":days+" days away"}</div>
</div>
<button onClick={()=>updateState(prev=>({...prev,exams:prev.exams.filter((_,j)=>j!==i)}))} style={{ background:"none",border:"none",fontSize:18,color:cs.textLight,cursor:"pointer",padding:4 }}>×</button>
</div>
);
})}
<div style={{ display:"flex",gap:8,marginTop:8 }}>
<input style={{...inputStyle,flex:1}} placeholder="Exam name" value={examName} onChange={e=>setExamName(e.target.value)}/>
<input style={{...inputStyle,width:130}} type="date" value={examDate} onChange={e=>setExamDate(e.target.value)}/>
<button onClick={()=>{ if(!examName||!examDate){showToast("Enter name and date 📅");return;} updateState(prev=>({...prev,exams:[...prev.exams,{name:examName,date:examDate}]})); setExamName("");setExamDate("");showToast("Exam added 📅"); }} style={{...btn,padding:"10px 14px",borderRadius:12,fontSize:14}}>Add</button>
</div>
</div>
</div>
)}

{/* SETTINGS */}
{screen==="settings" && (
<div style={{ padding:"0 20px",animation:"fadeUp 0.4s ease" }}>
<div style={{ padding:"52px 0 20px",textAlign:"center" }}>
<div style={{ fontFamily:"'Dancing Script',cursive",fontSize:38,color:cs.dusty }}>bloom</div>
<div style={{ fontSize:13,color:cs.textLight,marginTop:4 }}>make it yours</div>
</div>
{/* Appearance */}
<div style={{ marginBottom:8 }}>
<div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:cs.textLight,padding:"0 4px",marginBottom:8 }}>Appearance</div>
<div style={{...card,padding:"18px 20px"}}>
{/* Row — tapping opens/closes the menu */}
<div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer" }} onClick={()=>setThemeMenuOpen(o=>!o)}>
<div>
<div style={{ fontWeight:700,fontSize:15,color:cs.text }}>Color Palette</div>
<div style={{ fontSize:12,color:cs.textLight,marginTop:2 }}>Currently: {THEME_LABELS[appState.theme]}</div>
</div>
<div style={{ display:"flex",alignItems:"center",gap:10 }}>
<div style={{ width:28,height:28,borderRadius:"50%",background:THEME_GRADIENTS[appState.theme],boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}/>
<div style={{ fontSize:18,color:cs.textLight,transform:themeMenuOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.3s" }}>›</div>
</div>
</div>
{/* Collapsible grid */}
{themeMenuOpen && (
<div style={{ marginTop:16,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,animation:"fadeUp 0.3s ease" }}>
{Object.keys(THEMES).map(name=>(
<div key={name} onClick={()=>{ updateState(prev=>({...prev,theme:name})); }} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer" }}>
<div style={{ width:44,height:44,borderRadius:"50%",background:THEME_GRADIENTS[name],border:`3px solid ${appState.theme===name?cs.dusty:"transparent"}`,transform:appState.theme===name?"scale(1.12)":"scale(1)",transition:"all 0.2s",boxShadow:appState.theme===name?"0 4px 12px rgba(0,0,0,0.2)":"0 2px 6px rgba(0,0,0,0.08)" }}/>
<div style={{ fontSize:10,fontWeight:700,color:appState.theme===name?cs.dusty:cs.textLight,textAlign:"center",lineHeight:1.2 }}>{THEME_LABELS[name]}</div>
</div>
))}
</div>
)}
</div>
</div>
{/* Reminders */}
<div style={{ marginBottom:8 }}>
<div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:cs.textLight,padding:"0 4px",marginBottom:8 }}>Daily Reminder</div>
<div style={{...card,padding:"18px 20px"}}>
<div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom: appState.settings.reminderOn?16:0 }}>
<div>
<div style={{ fontWeight:700,fontSize:15,color:cs.text }}>Daily Reminders</div>
<div style={{ fontSize:12,color:cs.textLight,marginTop:2 }}>Get a nudge each study day</div>
</div>
<div style={toggleStyle(appState.settings.reminderOn)} onClick={()=>updateState(prev=>({...prev,settings:{...prev.settings,reminderOn:!prev.settings.reminderOn}}))}>
<div style={toggleKnob(appState.settings.reminderOn)}/>
</div>
</div>
{appState.settings.reminderOn && (
<div style={{ overflow:"hidden",transition:"all 0.35s ease" }}>
{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day=>{
const cfg = appState.settings.schedule[day];
return (
<div key={day} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${cs.blush}33` }}>
<div style={{ display:"flex",alignItems:"center",gap:10 }}>
<div style={{ fontWeight:700,fontSize:14,color:cs.text,width:36 }}>{day}</div>
<div style={toggleStyle(cfg.on)} onClick={()=>updateState(prev=>({...prev,settings:{...prev.settings,schedule:{...prev.settings.schedule,[day]:{...cfg,on:!cfg.on}}}}))}>
<div style={toggleKnob(cfg.on)}/>
</div>
<span style={{ fontSize:12,color:cs.textLight,fontWeight:600 }}>{cfg.on?"On":"Off"}</span>
</div>
<input type="time" value={cfg.time} disabled={!cfg.on} onChange={e=>updateState(prev=>({...prev,settings:{...prev.settings,schedule:{...prev.settings.schedule,[day]:{...cfg,time:e.target.value}}}}))} style={{ border:`2px solid ${cs.blush}`,borderRadius:10,padding:"6px 10px",fontFamily:"inherit",fontSize:14,fontWeight:700,color:cs.dusty,background:cs.cream,outline:"none",width:100,textAlign:"center",opacity:cfg.on?1:0.4 }}/>
</div>
);
})}
</div>
)}
</div>
</div>
{/* Subjects */}
<div style={{ marginBottom:8 }}>
<div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:cs.textLight,padding:"0 4px",marginBottom:8 }}>Subjects</div>
<div style={{...card,padding:"18px 20px"}}>
<div style={{ fontWeight:700,fontSize:15,color:cs.text,marginBottom:4 }}>Your Subjects</div>
<div style={{ fontSize:12,color:cs.textLight,marginBottom:12 }}>Tap to remove</div>
<div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
{appState.settings.subjects.map(s=>(
<button key={s} style={chipStyle(true)} onClick={()=>updateState(prev=>({...prev,settings:{...prev.settings,subjects:prev.settings.subjects.filter(x=>x!==s)}}))}>{s} ×</button>
))}
</div>
<div style={{ display:"flex",gap:8 }}>
<input style={{...inputStyle,flex:1}} placeholder="Add subject..." value={newSubject} onChange={e=>setNewSubject(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&newSubject.trim()){updateState(prev=>({...prev,settings:{...prev.settings,subjects:[...prev.settings.subjects,newSubject.trim()]}}));setNewSubject("");}}}/>
<button style={{...btn,padding:"8px 16px",borderRadius:12,fontSize:14}} onClick={()=>{ if(newSubject.trim()){updateState(prev=>({...prev,settings:{...prev.settings,subjects:[...prev.settings.subjects,newSubject.trim()]}}));setNewSubject(""); }}}>Add</button>
</div>
</div>
</div>
{/* Forgiving mode */}
<div style={{ marginBottom:16 }}>
<div style={{ fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:cs.textLight,padding:"0 4px",marginBottom:8 }}>Streak</div>
<div style={{...card,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px"}}>
<div>
<div style={{ fontWeight:700,fontSize:15,color:cs.text }}>Forgiving Mode</div>
<div style={{ fontSize:12,color:cs.textLight,marginTop:2 }}>Rest days don't break your streak</div>
</div>
<div style={toggleStyle(appState.settings.forgivingMode)} onClick={()=>updateState(prev=>({...prev,settings:{...prev.settings,forgivingMode:!prev.settings.forgivingMode}}))}>
<div style={toggleKnob(appState.settings.forgivingMode)}/>
</div>
</div>
</div>
<button style={{...btn,width:"100%",padding:16,borderRadius:20,fontSize:16}} onClick={()=>showToast("Settings saved!")}>
Save Settings
</button>
</div>
)}

{/* NAV */}
<nav style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:cs.navBg,backdropFilter:"blur(12px)",borderTop:`1px solid ${cs.blush}44`,padding:"12px 0 20px",zIndex:100,display:"flex",justifyContent:"space-around",boxShadow:"0 -4px 20px rgba(0,0,0,0.06)" }}>
{navItems.map(({id,label,Icon})=>{
const active = screen===id;
const color = active ? cs.dusty : cs.textLight;
return (
<button key={id} onClick={()=>setScreen(id)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,fontFamily:"inherit",fontSize:11,fontWeight:600,color,transition:"all 0.2s ease",padding:"4px 12px" }}>
<span style={{ width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",transform:active?"scale(1.15)":"scale(1)",transition:"transform 0.2s" }}><Icon color={color}/></span>
{label}
</button>
);
})}
</nav>
</div>
);
}
