"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, ChevronRight, ShieldAlert, UtensilsCrossed } from "lucide-react"
import { UserMenu } from "@/components/UserMenu"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 selection:bg-rose-500/30">
      {/* User Session Header */}
      <div className="fixed top-0 right-0 p-6 z-50">
        <UserMenu />
      </div>

      <div className="max-w-md w-full space-y-10">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">SpotOn Competitive Battlecards</h1>
          <p className="text-slate-400">Choose your product line to get started.</p>
        </motion.header>

        {/* Product Type Cards */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/express">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-800 hover:border-slate-700 active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">SpotOn Express</h2>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 transition-colors flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/rpos">
              <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:bg-slate-800 hover:border-slate-700 active:scale-[0.98]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-100">SpotOn RPOS</h2>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-rose-500 transition-colors flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </motion.div>
        </div>

      </div>
    </main>
  )
}
