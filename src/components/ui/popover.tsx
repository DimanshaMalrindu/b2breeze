import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const Popover: React.FC<PopoverProps> = ({ children }) => {
    return <div className="relative">{children}</div>
}

interface PopoverTriggerProps {
    asChild?: boolean
    children: React.ReactNode
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, asChild }) => {
    if (asChild && React.isValidElement(children)) {
        return children
    }
    return <>{children}</>
}

interface PopoverContentProps {
    className?: string
    children: React.ReactNode
    align?: "start" | "center" | "end"
    side?: "top" | "right" | "bottom" | "left"
}

const PopoverContent: React.FC<PopoverContentProps> = ({
    className,
    children,
    align = "center",
    side = "bottom",
}) => {
    return (
        <div
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in",
                side === "bottom" && "top-full mt-1",
                side === "top" && "bottom-full mb-1",
                side === "left" && "right-full mr-1",
                side === "right" && "left-full ml-1",
                align === "start" && "left-0",
                align === "center" && "left-1/2 -translate-x-1/2",
                align === "end" && "right-0",
                className
            )}
        >
            {children}
        </div>
    )
}

export { Popover, PopoverTrigger, PopoverContent }
