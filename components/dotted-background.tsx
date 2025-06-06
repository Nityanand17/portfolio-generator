"use client"

export function DottedBackground() {
  return (
    <>
      {/* Light mode dotted background */}
      <div className="absolute dark:hidden inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotted-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#e5e7eb" />
            </pattern>
          </defs>
          <rect width="100%" opacity={0.45} height="100%" fill="url(#dotted-pattern)" />
        </svg>
      </div>
      
      {/* Light mode diagonal stripes background */}
      <div className="absolute dark:hidden inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="diagonal-stripes" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M -2,2 l 4,-4 M 0,10 l 10,-10 M 8,12 l 4,-4" 
                stroke="#e5e7eb" strokeWidth="1.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" opacity={0.25} height="100%" fill="url(#diagonal-stripes)" />
        </svg>
      </div>
      
      {/* Dark mode background */}
      <div className="absolute hidden dark:block inset-0 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotted-pattern-dark" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#333333" />
            </pattern>
            <pattern id="diagonal-stripes-dark" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M -2,2 l 4,-4 M 0,10 l 10,-10 M 8,12 l 4,-4" 
                stroke="#333333" strokeWidth="1.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" opacity={0.15} height="100%" fill="url(#dotted-pattern-dark)" />
          <rect width="100%" opacity={0.1} height="100%" fill="url(#diagonal-stripes-dark)" />
        </svg>
      </div>
    </>
  )
}
