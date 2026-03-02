import { useSession, signOut } from "next-auth/react";
import { LogOut, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!session?.user) return null;

    const isAdmin = !!session.user.isAdmin;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
                {session.user.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-slate-700"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <User className="w-4 h-4 text-indigo-400" />
                    </div>
                )}
                <span className="text-sm font-medium text-slate-200 hidden sm:block">
                    {session.user.name?.split(" ")[0]}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-150">
                    <div className="px-4 py-2 border-b border-slate-800 mb-2">
                        <p className="text-sm font-bold text-slate-100 truncate">
                            {session.user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                    </div>

                    {isAdmin && (
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                        >
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            Admin Dashboard
                        </Link>
                    )}

                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
