import { type Message } from "ai"
import { type Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type { Message }

export interface DatasourceType {
  id: string
  name: string
  description: string
  url: string
  type: string
  createdAt: Date
  updatedAt: Date
}

export interface BadgeProps {
  children: React.ReactNode
  className?: string
} 