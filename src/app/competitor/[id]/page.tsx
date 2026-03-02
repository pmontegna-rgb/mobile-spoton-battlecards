"use client"

import { useEffect, useState, use } from "react"
import { BattlecardData, BattlecardSection } from "@/data/competitors"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Flame, MessageCircle, ShieldCheck, Swords, LayoutList } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionItem, Card } from "@/components/ui"
import { notFound } from "next/navigation"

export default function CompetitorView({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15 requires awaiting/unwrapping params
    const resolvedParams = use(params)
    const [competitor, setCompetitor] = useState<BattlecardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<string>("")

    useEffect(() => {
        fetch('/api/competitors')
            .then(res => res.json())
            .then((data: BattlecardData[]) => {
                const found = data.find(c => c.id === resolvedParams.id)
                if (found) {
                    setCompetitor(found)
                    setActiveTab(found.sections?.[0]?.id || "")
                }
                setLoading(false)
            })
    }, [resolvedParams.id])

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
                <div className="text-slate-500 animate-pulse text-sm">Loading competitor...</div>
            </main>
        )
    }

    if (!competitor) {
        notFound()
    }

    const getIconForSection = (id: string) => {
        switch (id) {
            case "painPoints": return <Flame className="w-4 h-4" />
            case "starters": return <MessageCircle className="w-4 h-4" />
            case "spotonStrengths": return <ShieldCheck className="w-4 h-4" />
            case "objections": return <Swords className="w-4 h-4" />
            default: return <LayoutList className="w-4 h-4" />
        }
    }

    const activeSection = competitor.sections.find((s: BattlecardSection) => s.id === activeTab);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="flex items-center p-4 gap-3">
                    <Link href={competitor.productType === "Express" ? "/express" : "/rpos"}>
                        <div className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-800 active:bg-slate-700 transition">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold leading-none">{competitor.name}</h1>
                    </div>
                </div>

                {/* Scrollable Tab Navigation */}
                <div className="flex overflow-x-auto no-scrollbar px-2 pb-2 gap-1 snap-x">
                    {competitor.sections.map((section: BattlecardSection) => {
                        const isActive = activeTab === section.id
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveTab(section.id)}
                                className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all
                  ${isActive ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"}
                `}
                            >
                                {getIconForSection(section.id)}
                                {section.title}
                            </button>
                        )
                    })}
                </div>
            </header>

            {/* Tab Content Area */}
            <div className="flex-1 p-4 pb-20 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeSection && (
                        <motion.div
                            key={activeSection.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-rose-500">{activeSection.title}</h2>
                                </div>

                                {activeSection.type === "string-array" && (
                                    <div className="space-y-3">
                                        {activeSection.items.map((item: string | Record<string, string>, idx: number) => (
                                            <div key={idx} className="flex gap-4 items-start bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold font-mono text-sm">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-slate-200 pt-1 leading-snug">{item as string}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection.type === "object-array" && activeSection.id === "objections" && (
                                    <Accordion>
                                        {activeSection.items.map((obj: string | Record<string, string>, idx: number) => (
                                            <AccordionItem key={idx} title={
                                                <div className="flex flex-col text-left">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">{(obj as Record<string, string>).theirStrength}</span>
                                                    <span className="text-slate-200 leading-snug">&quot;{(obj as Record<string, string>).objection}&quot;</span>
                                                </div>
                                            }>
                                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2 block">Our Counter</span>
                                                    <p className="text-sm leading-relaxed text-emerald-50">{(obj as Record<string, string>).counterPoints || (obj as Record<string, string>).counter}</p>
                                                </div>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}

                                {activeSection.type === "object-array" && activeSection.id !== "objections" && (
                                    <div className="space-y-4">
                                        {activeSection.items.map((itemValue: string | Record<string, string>, idx: number) => {
                                            const item = itemValue as Record<string, string>;
                                            if (activeSection.fields) {
                                                const firstField = activeSection.fields[0]?.key;
                                                const descriptionField = activeSection.fields.find(f => f.multiline)?.key || activeSection.fields[1]?.key || '';

                                                return (
                                                    <Card key={idx} className="border-l-4 border-l-rose-500">
                                                        <h3 className="font-semibold text-lg">{item[firstField] || "Detail"}</h3>
                                                        {descriptionField && <p className="text-slate-300 mt-2 text-sm leading-relaxed">{item[descriptionField]}</p>}

                                                        {activeSection.fields.filter(f => f.key !== firstField && f.key !== descriptionField).map(f => (
                                                            <div key={f.key} className="mt-3">
                                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{f.label}</span>
                                                                <p className="text-sm text-slate-300 mt-1">{item[f.key]}</p>
                                                            </div>
                                                        ))}
                                                    </Card>
                                                )
                                            } else {
                                                // Fallback for missing fields definition
                                                return (
                                                    <Card key={idx} className="border-l-4 border-l-rose-500 space-y-2">
                                                        {Object.entries(item).map(([k, v]: [string, unknown]) => (
                                                            <div key={k}>
                                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">{k}</span>
                                                                <p className="text-sm text-slate-300">{String(v)}</p>
                                                            </div>
                                                        ))}
                                                    </Card>
                                                )
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* CSS to hide scrollbar but keep functionality for dynamic tabs */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
        </main>
    )
}
