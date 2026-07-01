interface TodoStatsProps {
  total: number
  completed: number
  active: number
}

export default function TodoStats({ total, completed, active }: TodoStatsProps) {
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl bg-card border-2 border-border p-4">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          Total
        </div>
        <div className="text-3xl font-bold text-foreground">
          {total}
        </div>
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-4">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          Active
        </div>
        <div className="text-3xl font-bold text-primary">
          {active}
        </div>
      </div>

      <div className="rounded-xl bg-card border-2 border-border p-4">
        <div className="text-sm font-medium text-muted-foreground mb-1">
          Progress
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-foreground">
            {completionPercentage}%
          </div>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
