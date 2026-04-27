import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const AppLoader = () => (
  <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#0b0d14] px-6 text-white">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-10%] top-[-8%] h-56 w-56 rounded-full bg-violet-600/18 blur-3xl" />
      <div className="absolute bottom-[-12%] right-[-8%] h-64 w-64 rounded-full bg-indigo-500/14 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14),_transparent_32%),linear-gradient(180deg,_rgba(15,23,42,0.12),_rgba(11,13,20,0.96))]" />
    </div>

    <div className="relative w-full max-w-sm rounded-[30px] border border-white/10 bg-[#11141d]/95 p-8 shadow-[0_30px_90px_rgba(3,7,18,0.55)] backdrop-blur">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 shadow-[0_12px_40px_rgba(124,58,237,0.18)]">
          <div className="grid grid-cols-2 gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-200" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-300 [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-300 [animation-delay:240ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:360ms]" />
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold">TalkAI</p>
          <p className="text-sm text-slate-400">Restoring your workspace</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-2 rounded-full bg-white/6">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-violet-500 via-violet-300 to-transparent" />
        </div>
        <div className="h-2 rounded-full bg-white/6">
          <div className="h-full w-5/6 animate-pulse rounded-full bg-gradient-to-r from-white/20 via-violet-300/60 to-transparent [animation-delay:160ms]" />
        </div>
        <p className="pt-2 text-sm text-slate-400">
          Preparing chats, syncing your session, and getting everything ready.
        </p>
      </div>
    </div>
  </div>
);

const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <AppLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
