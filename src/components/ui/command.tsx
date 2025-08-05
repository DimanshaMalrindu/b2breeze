import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommandProps {
    className?: string
    children: React.ReactNode
}

const Command: React.FC<CommandProps> = ({ className, children }) => (
    <div
        className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
            className
        )}
    >
        {children}
    </div>
)

interface CommandInputProps {
    placeholder?: string
    className?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CommandInput: React.FC<CommandInputProps> = ({ className, placeholder, value, onChange }) => (
    <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
            className={cn(
                "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
)

interface CommandListProps {
    className?: string
    children: React.ReactNode
}

const CommandList: React.FC<CommandListProps> = ({ className, children }) => (
    <div
        className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    >
        {children}
    </div>
)

interface CommandEmptyProps {
    className?: string
    children: React.ReactNode
}

const CommandEmpty: React.FC<CommandEmptyProps> = ({ className, children }) => (
    <div
        className={cn("py-6 text-center text-sm", className)}
    >
        {children}
    </div>
)

interface CommandGroupProps {
    className?: string
    children: React.ReactNode
}

const CommandGroup: React.FC<CommandGroupProps> = ({ className, children }) => (
    <div
        className={cn(
            "overflow-hidden p-1 text-foreground",
            className
        )}
    >
        {children}
    </div>
)

interface CommandItemProps {
    className?: string
    children: React.ReactNode
    onSelect?: (value: string) => void
    value?: string
}

const CommandItem: React.FC<CommandItemProps> = ({ className, children, onSelect, value }) => (
    <div
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
            className
        )}
        onClick={() => onSelect?.(value || "")}
    >
        {children}
    </div>
)

export {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
}
