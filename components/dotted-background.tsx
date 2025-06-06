"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function DottedBackground() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Light mode dotted background */}
      <div className="absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
           style={{ opacity: resolvedTheme === 'dark' ? 0 : 1 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotted-pattern-light" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#e5e7eb" />
            </pattern>
          </defs>
          <rect width="100%" opacity={0.45} height="100%" fill="url(#dotted-pattern-light)" />
        </svg>
      </div>
      
      {/* Light mode diagonal stripes background */}
      <div className="absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
           style={{ opacity: resolvedTheme === 'dark' ? 0 : 1 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="diagonal-stripes-light" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M -2,2 l 4,-4 M 0,10 l 10,-10 M 8,12 l 4,-4" 
                stroke="#e5e7eb" strokeWidth="1.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" opacity={0.25} height="100%" fill="url(#diagonal-stripes-light)" />
        </svg>
      </div>
      
      {/* Dark mode dotted background */}
      <div className="absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
           style={{ opacity: resolvedTheme === 'dark' ? 1 : 0 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotted-pattern-dark" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#333333" />
            </pattern>
          </defs>
          <rect width="100%" opacity={0.15} height="100%" fill="url(#dotted-pattern-dark)" />
        </svg>
      </div>
      
      {/* Dark mode diagonal stripes background */}
      <div className="absolute inset-0 z-0 transition-opacity duration-500 ease-in-out"
           style={{ opacity: resolvedTheme === 'dark' ? 1 : 0 }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="diagonal-stripes-dark" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M -2,2 l 4,-4 M 0,10 l 10,-10 M 8,12 l 4,-4" 
                stroke="#333333" strokeWidth="1.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" opacity={0.1} height="100%" fill="url(#diagonal-stripes-dark)" />
        </svg>
      </div>
    </>
  )
}
