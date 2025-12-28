
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Timer } from './components/Timer';
import { TodoList } from './components/TodoList';
import { Notes } from './components/Notes';
import { NeuralAIStudio } from './components/AIStudio';
import { MusicPlayer } from './components/MusicPlayer';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { Tab, User } from './types';
import { isCloudConnected } from './services/databaseService';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(() => {
    return localStorage.getItem('libraroom_started') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('libraroom_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('libraroom_last_tab');
    return (saved as Tab) || 'timer';
  });

  const [cloudSynced, setCloudSynced] = useState(false);

  useEffect(() => {
    localStorage.setItem('libraroom_last_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const checkSync = () => {
      setCloudSynced(isCloudConnected());
    };
    checkSync();
    const interval = setInterval(checkSync, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    localStorage.setItem('libraroom_started', 'true');
  };

  const handleBackToLanding = () => {
    setHasStarted(false);
    localStorage.removeItem('libraroom_started');
  };

  const handleLogin = (newUser: User) => {
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    setUser(sessionUser);
    localStorage.setItem('libraroom_user', JSON.stringify(sessionUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('libraroom_user');
  };

  const navItems = [
    { id: 'timer', label: 'Focus', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'tasks', label: 'Tasks', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { id: 'notes', label: 'Study', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    { id: 'ai', label: 'Neural', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { id: 'music', label: 'Ambient', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> },
  ];

  if (!hasStarted && !user) {
    return <LandingPage onStart={handleStart} />;
  }

  if (!user) {
    return <Auth onLogin={handleLogin} onBack={handleBackToLanding} />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden text-slate-100 bg-[#020617]">
      <aside className="hidden lg:flex flex-col w-72 bg-[#020617] border-r border-white/5 p-6 z-20 overflow-y-auto">
        <div className="flex items-center gap-3 mb-12 flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('timer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-xl italic tracking-tighter">L</span>
          </div>
          <div className="whitespace-nowrap">
            <h1 className="text-lg font-bold text-white tracking-tight leading-none mb-1">Libraroom AI</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Intelligent Zen Space</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 min-h-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-all group whitespace-nowrap ${
                activeTab === item.id 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-500/5' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                {item.icon}
              </div>
              <span className="text-[13px] font-semibold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-white/5 flex-shrink-0 space-y-4">
          <div className="px-4">
            <div className="flex justify-between items-center mb-3">
               <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">System Status</p>
               {cloudSynced ? (
                 <div className="flex items-center gap-1.5" title="Connected to Neon Cloud">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                   <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-tighter">Synced</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-1.5" title="LocalStorage Only">
                   <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                   <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">Local</span>
                 </div>
               )}
            </div>
            <div 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-xs">{user.nickname[0].toUpperCase()}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-white truncate">{user.nickname}</p>
                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="text-[9px] text-slate-500 hover:text-rose-400 uppercase font-bold tracking-widest transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
          <a href="https://pk.linkedin.com/in/sambinc_" target="_blank" rel="noopener noreferrer" className="block w-full py-4 text-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform whitespace-nowrap text-white">Contact Developer</a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-12 py-6 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
             <div onClick={() => setActiveTab('timer')} className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm cursor-pointer">L</div>
             <span className="font-bold text-lg whitespace-nowrap">Libraroom AI</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs text-slate-500 font-semibold">Session Status:</span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${cloudSynced ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                {cloudSynced ? 'Cloud Synced' : 'Local Workspace'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setActiveTab('profile')} className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 hover:scale-110 active:scale-95 ${activeTab === 'profile' ? 'border-indigo-500' : 'border-indigo-500/20'}`}>
                <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`} className="w-full h-full rounded-full object-cover bg-slate-800" alt="User Profile" />
             </button>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-12 max-w-6xl mx-auto w-full pb-32 lg:pb-12">
          {activeTab === 'timer' && <Timer />}
          {activeTab === 'tasks' && <TodoList userEmail={user.email} />}
          {activeTab === 'notes' && <Notes userEmail={user.email} />}
          {activeTab === 'ai' && <NeuralAIStudio userEmail={user.email} />}
          {activeTab === 'music' && <MusicPlayer />}
          {activeTab === 'profile' && <Profile user={user} onLogout={handleLogout} onBack={() => setActiveTab('timer')} />}
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50">
        <div className="flex justify-around items-center h-[76px] bg-slate-950/40 backdrop-blur-3xl rounded-[2.2rem] px-2 shadow-2xl border border-white/10">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={`flex flex-col items-center justify-center gap-1 w-full h-[60px] rounded-2xl relative transition-all ${activeTab === item.id ? 'text-indigo-400' : 'text-slate-500'}`}>
              {activeTab === item.id && <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl border border-indigo-500/20" />}
              {item.icon}
              <span className="text-[8px] font-bold tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default App;
