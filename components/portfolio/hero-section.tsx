"use client"
import { motion } from "framer-motion"
import { TypingAnimation } from "./typing-animation"
import Image from "next/image"
import HeroBgAnimation from "../HeroBgAnimation"

export function HeroSection({
  name,
  title,
  roles = [],
  profileImage,
}: {
  name: string
  title: string
  roles?: string[]
  profileImage?: string
}) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center py-20 relative">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroBgAnimation />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 max-w-4xl w-full px-4 relative z-10"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {profileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-48 h-48 relative overflow-hidden rounded-full border-4 border-theme"
            >
              <Image
                src={profileImage || "/placeholder.svg"}
                alt={name}
                width={192}
                height={192}
                className="object-cover"
              />
            </motion.div>
          )}

          <div className="text-left">
            <h2 className="text-xl md:text-2xl mb-2">Hi, I am</h2>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-theme">{name}</h1>
            <div className="text-xl md:text-2xl mb-2">
              I am a{" "}
              <span className="text-theme font-medium">
                {roles && roles.length > 0 ? <TypingAnimation phrases={roles} /> : title}
              </span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={() => {
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="animate-bounce bg-theme text-white rounded-full p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
