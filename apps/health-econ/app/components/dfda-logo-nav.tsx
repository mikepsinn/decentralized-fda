"use client"

import React from "react"
import Link from "next/link"
import { NavItem } from "@/types"

interface DfdaLogoNavMenuProps {
  navItems?: NavItem[]
}

export function DfdaLogoNavMenu({ navItems = [] }: DfdaLogoNavMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href="/" className="text-xl font-bold">
        DFDA
      </Link>
      {navItems.length > 0 && (
        <div className="flex items-center gap-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href || "/"}
              className="text-sm hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
