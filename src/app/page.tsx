"use client"

import { competitors } from "@/data/competitors"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, ShieldAlert } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 selection:bg-rose-500/30">
      <div className="max-w-md mx-auto space-y-8 mt-12">

        <header className="space-y-2 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight">Battlecards</h1>
          <p className="text-slate-400">Select a competitor to view talking points.</p>
        </header>

        <div className="space-y-3 pt-4">
          {competitors.map((comp, idx) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/competitor/${comp.id}`}>
                <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:bg-slate-800 hover:border-slate-700 active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100">{comp.name}</h2>
                      <p className="text-sm text-slate-500 mt-1">{comp.productType} Compete</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                    </div>
                  </div>

                  {/* Subtle decorative gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  )
}
