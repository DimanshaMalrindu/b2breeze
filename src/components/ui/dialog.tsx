import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const Dialog: React.FC<DialogProps> = ({ children }) => {
    return <>{children}</>
}

interface DialogTriggerProps {
    asChild?: boolean
    children: React.ReactNode
    onClick?: () => void
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onClick, asChild }) => {
    if (asChild && React.isValidElement(children)) {
        const childProps = children.props as any
        return React.cloneElement(children, {
            ...childProps,
            onClick: (e: React.MouseEvent) => {
                childProps.onClick?.(e)
                onClick?.()
            }
        })
    }
    return <div onClick={onClick}>{children}</div>
}

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>
}

const DialogClose: React.FC<{ children?: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
    return <div onClick={onClick}>{children}</div>
}

interface DialogOverlayProps {
    className?: string
    onClick?: () => void
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
    ({ className, onClick }, ref) => (
        <div
            ref={ref}
            className={cn(
                "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
                className
            )}
            onClick={onClick}
        />
    )
)
DialogOverlay.displayName = "DialogOverlay"

interface DialogContentProps {
    className?: string
    children: React.ReactNode
    onClose?: () => void
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({ className, children, onClose }, ref) => (
        <DialogPortal>
            <DialogOverlay onClick={onClose} />
            <div
                ref={ref}
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </div>
        </DialogPortal>
    )
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DialogDescription.displayName = "DialogDescription"

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
