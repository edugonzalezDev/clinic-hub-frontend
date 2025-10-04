import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-2 py-1",
        md: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base",
      },
      variant: {
        default: "border-input",
        error:
          "border-destructive focus-visible:ring-destructive/50 aria-invalid:border-destructive text-destructive",
        ghost: "border-transparent bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">, // evitamos colisión con prop nativa
    VariantProps<typeof inputVariants> {
  startContent?: React.ReactNode
  endContent?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, startContent, endContent, size, variant, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startContent && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {startContent}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            inputVariants({ size, variant }),
            startContent ? "pl-10" : "",
            endContent ? "pr-10" : "",
            className
          )}
          {...props}
        />
        {endContent && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {endContent}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
