"use client"

import React from "react"
import { User } from "next-auth"
import { NavItem } from "@/types"

interface UserNavDisplayProps {
  user: Pick<User, "name" | "image" | "email">
  avatarNavItems?: NavItem[]
  buttonVariant?: string
}

export function UserNavDisplay({
  user,
  avatarNavItems = [],
  buttonVariant = "default"
}: UserNavDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || "User avatar"}
            className="h-8 w-8 rounded-full"
          />
        )}
        <span>{user.name}</span>
      </div>
      {avatarNavItems.length > 0 && (
        <div className="flex items-center gap-2">
          {avatarNavItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-sm hover:underline"
            >
              {item.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
} 