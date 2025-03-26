import { NavItem } from "@/types"

// Default navigation items
const defaultTopNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" }
]

const defaultAvatarNav: NavItem[] = [
  { title: "Profile", href: "/profile" },
  { title: "Settings", href: "/settings" }
]

export const navigationConfig = {
  topNav: defaultTopNav,
  avatarNav: defaultAvatarNav
}

export function getNavigationForDomain(domain: string) {
  // For now, return default navigation
  return navigationConfig
} 