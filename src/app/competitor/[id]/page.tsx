"use client"

import { useMemo, useState, use } from "react"
import { competitors } from "@/data/competitors"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Flame, MessageCircle, ShieldCheck, Swords } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionItem, Card } from "@/components/ui"
import { notFound } from "next/navigation"

type TabType = "pain" | "starters" | "strengths" | "objections"

export default function CompetitorView({ params }: { params: Promise<{ id: string }> }) {
    const [activeTab, setActiveTab] = useState<TabType>("pain")

    // Next.js 15 requires awaiting/unwrapping params
    const resolvedParams = use(params)

    const competitor = useMemo(() => competitors.find(c => c.id === resolvedParams.id), [resolvedParams.id])

    if (!competitor) {
        notFound()
    }

    const tabs = [
        { id: "pain", label: "Pain Points", icon: Flame },
        { id: "starters", label: "Ask Them", icon: MessageCircle },
        { id: "strengths", label: "Why Us", icon: ShieldCheck },
        { id: "objections", label: "Objections", icon: Swords },
    ] as const

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="flex items-center p-4 gap-3">
                    <Link href="/">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-800 active:bg-slate-700 transition">
                            <ChevronLeft className="w-6 h-6" />
                        </div>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold leading-none">{competitor.name}</h1>
                        <p className="text-sm text-slate-400 mt-1">SpotOn {competitor.productType} Compete</p>
                    </div>
                </div>

                {/* Scrollable Tab Navigation */}
                <div className="flex overflow-x-auto no-scrollbar px-2 pb-2 gap-1 snap-x">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all
                  ${isActive ? "bg-rose-500 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"}
                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </header>

            {/* Tab Content Area */}
            <div className="flex-1 p-4 pb-20 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {activeTab === "pain" && (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-rose-500">The Common Pain Points</h2>
                                    <p className="text-slate-400 text-sm mt-1">Why operators are leaving {competitor.name}. Listen for these.</p>
                                </div>
                                {competitor.painPoints.map((point, idx) => (
                                    <Card key={idx} className="border-l-4 border-l-rose-500">
                                        <h3 className="font-semibold text-lg">{point.title}</h3>
                                        <p className="text-slate-300 mt-2 text-sm leading-relaxed">{point.description}</p>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {activeTab === "starters" && (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-amber-500">Conversation Starters</h2>
                                    <p className="text-slate-400 text-sm mt-1">Questions to uncover their frustrations.</p>
                                </div>
                                <div className="space-y-3">
                                    {competitor.starters.map((starter, idx) => (
                                        <div key={idx} className="flex gap-4 items-start bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold font-mono text-sm">
                                                {idx + 1}
                                            </div>
                                            <p className="text-slate-200 pt-1 leading-snug">{starter}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "strengths" && (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-emerald-500">Introducing SpotOn</h2>
                                    <p className="text-slate-400 text-sm mt-1">Our specific advantages over {competitor.name}.</p>
                                </div>
                                {competitor.spotonStrengths.map((strength, idx) => (
                                    <Card key={idx} className="border-l-4 border-l-emerald-500">
                                        <h3 className="font-semibold text-lg">{strength.title}</h3>
                                        <p className="text-slate-300 mt-2 text-sm leading-relaxed">{strength.description}</p>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {activeTab === "objections" && (
                            <div className="space-y-4">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-indigo-400">Common Objections</h2>
                                    <p className="text-slate-400 text-sm mt-1">How to handle where {competitor.name} outperforms us.</p>
                                </div>
                                <Accordion>
                                    {competitor.objections.map((obj, idx) => (
                                        <AccordionItem key={idx} title={
                                            <div className="flex flex-col text-left">
                                                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">They ask about: {obj.theirStrength}</span>
                                                <span className="text-slate-200 leading-snug">"{obj.objection}"</span>
                                            </div>
                                        }>
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2 block">Our Counter</span>
                                                <p className="text-sm leading-relaxed text-emerald-50">{obj.counterPoints}</p>
                                            </div>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}
                    </motion.div>
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
