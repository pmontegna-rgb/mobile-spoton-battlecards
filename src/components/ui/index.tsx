"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("space-y-2", className)}>{children}</div>
}

export function AccordionItem({
    title,
    children,
    defaultOpen = false,
    className,
}: {
    title: React.ReactNode
    children: React.ReactNode
    defaultOpen?: boolean
    className?: string
}) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <div className={cn("rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-800 active:bg-slate-700"
            >
                <span className="font-medium text-slate-100">{title}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-1 text-slate-300 border-t border-slate-700/50">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm", className)}>
            {children}
        </div>
    )
}
