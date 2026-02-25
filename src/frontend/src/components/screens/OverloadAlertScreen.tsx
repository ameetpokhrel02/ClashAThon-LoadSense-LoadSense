import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowLeft, Calendar, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useWorkloadStore } from "@/store/workloadStore"

export default function OverloadAlertScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const { alerts, isLoading, fetchAlerts } = useWorkloadStore()

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const activeAlert = alerts[0]
  const tasks = activeAlert?.tasks_causing_overload || []

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff7400]" />
      </div>
    )
  }

  if (!activeAlert) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl mb-6">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        <Card className="w-full max-w-3xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">No Overload Detected</h2>
          <p className="text-muted-foreground">Your schedule looks manageable! Keep up the good work.</p>
          <Button className="mt-6 bg-[#ff7400] hover:bg-[#e66800] text-white" onClick={() => onNavigate('dashboard')}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl mb-6">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="w-full max-w-3xl shadow-2xl shadow-destructive/10 border-destructive/20 overflow-hidden">
        <div className="bg-destructive/10 p-8 border-b border-destructive/20 flex items-start gap-6">
          <div className="bg-destructive/20 p-4 rounded-full shrink-0">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-destructive">Workload Overload Detected</h1>
              <Badge variant="destructive" className="text-sm px-3 py-1 uppercase tracking-wider font-bold">
                {activeAlert.risk_level === 'critical' ? 'Critical' : 'High'} Risk
              </Badge>
            </div>
            <p className="text-lg text-destructive/80 max-w-xl">
              {activeAlert.message}
            </p>
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              The Conflict Zone ({formatDateRange(activeAlert.week_start, activeAlert.week_end)})
            </h3>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <div key={task._id || i} className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                  <div>
                    <h4 className="font-medium text-foreground">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{task.type || 'Task'} • {task.impact_level || 'Medium'} Impact</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <Clock className="w-4 h-4" />
                    Weight: {task.weight || 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-secondary rounded-lg flex justify-between items-center border border-border/50">
              <span className="font-medium">Total Load Score:</span>
              <span className="text-xl font-bold text-destructive">{activeAlert.load_score}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Recommended Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-primary/20 shadow-sm hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onNavigate('suggestion')}>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Start Early Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      Begin the CS301 project this weekend to spread the 15 hours over 5 days.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-muted-foreground/50 transition-colors cursor-pointer">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="bg-secondary p-2 rounded-full shrink-0 mt-1">
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Request Extension</h4>
                    <p className="text-sm text-muted-foreground">
                      Draft an email to your ENG205 professor requesting a 24h extension.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-secondary/30 p-6 border-t border-border flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Our intelligent analysis uses your historical completion rates to estimate effort.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>Ignore Warning</Button>
            <Button className="bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20" onClick={() => onNavigate('suggestion')}>
              View Study Plan
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
