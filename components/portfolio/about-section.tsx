"use client"

import { useInView } from "framer-motion"
import { useRef } from "react"
import { motion } from "framer-motion"

export function AboutSection({ id, about }: { id: string; about: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id={id} className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-theme">About Me</h2>
          <div className="h-0.5 w-16 bg-theme"></div>
          <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{about}</p>
        </motion.div>
      </div>
    </section>
  )
}
