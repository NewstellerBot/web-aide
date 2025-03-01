"use client"

import { useEffect, useState } from "react"

export function WorkflowAnimation() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative w-full h-[300px] bg-gradient-to-br from-primary/5 via-primary-muted/5 to-primary/5 rounded-lg p-8">
      <div className="relative h-full flex items-center justify-between">
        {/* Input Node */}
        <div
          className={`
            relative flex items-center justify-center w-[100px] h-[50px] 
            rounded-lg bg-gradient-to-b from-white/10 to-white/5 
            border border-white/10 backdrop-blur-sm
            transition-all duration-1000 transform
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          <span className="text-sm font-medium">Input</span>
          {/* Connection Line */}
          <div className="absolute left-full top-1/2 w-[calc(50vw/4)] h-px bg-gradient-to-r from-primary/50 to-primary-muted/50">
            {/* Animated Dot */}
            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-workflow-dot" />
          </div>
        </div>

        {/* Process Node */}
        <div
          className={`
            relative flex items-center justify-center w-[100px] h-[50px] 
            rounded-lg bg-gradient-to-b from-white/10 to-white/5 
            border border-white/10 backdrop-blur-sm
            transition-all duration-1000 delay-300 transform
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          <span className="text-sm font-medium">Process</span>
          {/* Connection Line */}
          <div className="absolute left-full top-1/2 w-[calc(50vw/4)] h-px bg-gradient-to-r from-primary/50 to-primary-muted/50">
            {/* Animated Dot */}
            <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-workflow-dot delay-300" />
          </div>
        </div>

        {/* Output Node */}
        <div
          className={`
            relative flex items-center justify-center w-[100px] h-[50px] 
            rounded-lg bg-gradient-to-b from-white/10 to-white/5 
            border border-white/10 backdrop-blur-sm
            transition-all duration-1000 delay-500 transform
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          <span className="text-sm font-medium">Output</span>
        </div>
      </div>
    </div>
  )
}

