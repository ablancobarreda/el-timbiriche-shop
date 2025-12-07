"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store-context"

const currencies = [
  { code: "USD", name: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "CUP", name: "CUP", symbol: "₱", flag: "🇨🇺" },
] as const

export function CurrencySelector() {
  const { currency, setCurrency } = useStore()

  const currentCurrency = currencies.find((c) => c.code === currency)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-foreground/80 hover:text-primary px-2">
          <span className="text-base">{currentCurrency?.flag}</span>
          <span className="text-sm font-medium">{currency}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onClick={() => setCurrency(c.code)}
            className={`gap-2 cursor-pointer ${currency === c.code ? "bg-primary/10 text-primary" : ""}`}
          >
            <span>{c.flag}</span>
            <span>{c.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
