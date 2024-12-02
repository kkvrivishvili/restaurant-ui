import * as React from "react"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-900 text-white",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-gray-800 text-white",
    outline: "border border-gray-200 text-gray-800"
  }

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
