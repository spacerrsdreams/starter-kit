import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AdminUsersStatsCardsProps = {
  totalUsers: number
  activeUsers: number
  subscribedUsers: number
  deactivatedUsers: number
}

type StatsCardItem = {
  label: string
  value: number
}

export function AdminUsersStatsCards({
  totalUsers,
  activeUsers,
  subscribedUsers,
  deactivatedUsers,
}: AdminUsersStatsCardsProps) {
  const cards: StatsCardItem[] = [
    { label: "Total users", value: totalUsers },
    { label: "Active users (seen in 30 days, within selected range)", value: activeUsers },
    { label: "Subscribed users", value: subscribedUsers },
    { label: "Deactivated accounts", value: deactivatedUsers },
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="bg-sidebar">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
