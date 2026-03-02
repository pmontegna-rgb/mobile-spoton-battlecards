"use client"

import { useEffect, useState } from "react"
import { BattlecardData } from "@/data/competitors"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react"

export default function RPOSPage() {
    const [rposCompetitors, setRposCompetitors] = useState<BattlecardData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/competitors')
            .then(res => res.json())
            .then((data: BattlecardData[]) => {
                const sorted = data.filter(c => c.productType === 'RPOS').sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
                setRposCompetitors(sorted);
                setLoading(false);
            });
    }, []);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 p-6 selection:bg-rose-500/30">
            <div className="max-w-md mx-auto space-y-6 mt-8">

                {/* Back + Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors mb-6 text-sm">
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                            <UtensilsCrossed className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">SpotOn RPOS</h1>
                            <p className="text-slate-400 text-sm">Select a competitor to view talking points.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Competitor List */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="text-slate-500 animate-pulse text-sm">Loading competitors...</div>
                    </div>
                ) : rposCompetitors.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-16 text-slate-500"
                    >
                        <UtensilsCrossed className="w-10 h-10 mx-auto mb-4 opacity-30" />
                        <p className="text-sm">RPOS battlecards coming soon.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {rposCompetitors.map((comp, idx) => (
                            <motion.div
                                key={comp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link href={`/competitor/${comp.id}`}>
                                    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:bg-slate-800 hover:border-slate-700 active:scale-[0.98]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-100">{comp.name}</h2>
                                            </div>
                                            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-rose-500 transition-colors">
                                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    )
}
