import "server-only"

import { UserRole } from "@/generated/prisma/client"

import { prisma } from "@/lib/prisma"
import type { AdminUsersListResponse, AdminUserSubscriptionStatus } from "@/features/admin/types/admin-users.types"

export async function listAdminUsers(): Promise<AdminUsersListResponse> {
  const [totalUsers, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        role: true,
        createdAt: true,
        lastActiveAt: true,
        deactivatedAt: true,
        billingSubscription: {
          select: {
            stripeStatus: true,
          },
        },
      },
    }),
  ])

  return {
    totalUsers,
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      image: user.image,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      lastActiveAt: user.lastActiveAt?.toISOString() ?? null,
      deactivatedAt: user.deactivatedAt?.toISOString() ?? null,
      subscriptionStatus: mapSubscriptionStatus(user.billingSubscription?.stripeStatus),
    })),
  }
}

function mapSubscriptionStatus(status: string | null | undefined): AdminUserSubscriptionStatus {
  if (status === "active") {
    return "active"
  }

  if (status === "canceled") {
    return "cancelled"
  }

  return "inactive"
}

type UpdateAdminUserData = {
  email?: string
  role?: UserRole
}

export async function updateAdminUser(userId: string, data: UpdateAdminUserData) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      role: true,
    },
  })
}

export async function deleteAdminUser(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
    select: {
      id: true,
    },
  })
}
