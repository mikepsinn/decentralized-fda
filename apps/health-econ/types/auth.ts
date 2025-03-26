import { DefaultSession } from "next-auth"

export interface ExtendedUser extends DefaultSession["user"] {
  id: string
  role?: string
  subscriptionTier?: string
  subscriptionStatus?: string
  subscriptionPeriodStart?: Date
  subscriptionPeriodEnd?: Date
} 