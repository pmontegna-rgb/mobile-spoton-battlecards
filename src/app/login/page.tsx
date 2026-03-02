"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ShieldAlert, LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const error = searchParams.get("error");

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16" />

                    <div className="relative text-center space-y-6">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-500/20">
                            <ShieldAlert className="w-10 h-10 text-indigo-400" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
                                SpotOn Battlecards
                            </h1>
                            <p className="text-slate-400">
                                Internal sales portal login.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                                {error === "AccessDenied"
                                    ? "Access restricted to @spoton.com accounts."
                                    : "An error occurred during sign in."}
                            </div>
                        )}

                        <button
                            onClick={() => signIn("google", { callbackUrl })}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-slate-100 text-slate-950 font-bold rounded-2xl hover:bg-white active:scale-[0.98] transition-all shadow-lg hover:shadow-white/5 group"
                        >
                            <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            Sign in with SpotOn
                        </button>

                        <p className="text-xs text-slate-500">
                            Authorized access only. By signing in, you agree to internal company security policies.
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-slate-500 animate-pulse text-sm">Loading...</div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
