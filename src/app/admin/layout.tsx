"use client";

import Link from 'next/link';
import { useSession } from "next-auth/react";
import { UserMenu } from "@/components/UserMenu";
import { ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-slate-500 animate-pulse text-sm">Verifying access...</div>
            </div>
        );
    }

    const isAdmin = !!session?.user.isAdmin;

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-rose-500/20">
                        <ShieldAlert className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Access Restricted</h1>
                    <p className="text-slate-400">
                        This area is reserved for SpotOn Content Administrators. If you believe this is an error, please contact the product team.
                    </p>
                    <Link href="/" className="inline-block px-6 py-3 bg-slate-800 text-slate-200 rounded-xl hover:bg-slate-700 transition font-medium">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans">
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Link href="/admin" className="text-xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                            SpotOn Competitor <span className="text-slate-100">CMS</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg shadow-sm hidden sm:block">
                            Exit Admin
                        </Link>
                        <UserMenu />
                    </div>
                </div>
            </header>
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>
        </div>
    );
}
