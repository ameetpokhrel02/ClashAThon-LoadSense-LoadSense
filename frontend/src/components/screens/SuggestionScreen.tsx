import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Clock, CheckCircle2, BookOpen, Lightbulb, Target, PlayCircle } from "lucide-react"

export default function SuggestionScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mb-6">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl shadow-primary/5 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Smart Study Plan</CardTitle>
              <CardDescription className="text-base">
                Optimized schedule to manage your upcoming workload peak.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Goal: CS301 Project</span>
                  <span className="font-bold text-primary">15h Total</span>
                </div>
                <Progress value={20} className="h-2 bg-primary/20 [&>div]:bg-primary" />
                <p className="text-xs text-muted-foreground mt-2">3h completed, 12h remaining</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/50">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Key Milestones
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>Research & Outline (Done)</span>
                  </li>
                  <li className="flex items-start gap-2 text-foreground font-medium">
                    <div className="w-4 h-4 rounded-full border-2 border-primary mt-0.5 shrink-0"></div>
                    <span>Core Implementation (In Progress)</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border-2 border-muted mt-0.5 shrink-0"></div>
                    <span>Testing & Debugging</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <div className="w-4 h-4 rounded-full border-2 border-muted mt-0.5 shrink-0"></div>
                    <span>Final Documentation</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-secondary p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Focus Mode</h4>
                <p className="text-sm text-muted-foreground">Block distractions for 2h</p>
              </div>
              <Button size="icon" className="ml-auto rounded-full bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20">
                <PlayCircle className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-2">
          <Card className="h-full shadow-xl shadow-primary/5 border-border/50">
            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold">Recommended Timeline</CardTitle>
                  <CardDescription>Spread the workload to avoid burnout</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
                  <Calendar className="w-3 h-3 mr-2 inline" />
                  Next 5 Days
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { day: "Today", date: "Feb 23", task: "CS301: Core Implementation", hours: 3, status: "current" },
                  { day: "Tomorrow", date: "Feb 24", task: "ENG205: Essay Outline & Intro", hours: 2, status: "upcoming" },
                  { day: "Wednesday", date: "Feb 25", task: "CS301: Testing & Debugging", hours: 4, status: "upcoming" },
                  { day: "Thursday", date: "Feb 26", task: "MATH210: Problem Set 4", hours: 5, status: "peak" },
                  { day: "Friday", date: "Feb 27", task: "ENG205: Final Polish & Submit", hours: 2, status: "upcoming" },
                ].map((item, i) => (
                  <div key={i} className={`p-6 flex items-start gap-6 transition-colors hover:bg-secondary/30 ${item.status === 'current' ? 'bg-primary/5' : ''}`}>
                    <div className="w-24 shrink-0 text-right pt-1">
                      <h4 className={`font-bold ${item.status === 'current' ? 'text-primary' : 'text-foreground'}`}>{item.day}</h4>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    
                    <div className="relative flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full z-10 ${
                        item.status === 'current' ? 'bg-primary ring-4 ring-primary/20' : 
                        item.status === 'peak' ? 'bg-destructive' : 'bg-muted-foreground/30'
                      }`}></div>
                      {i !== 4 && <div className="w-0.5 h-full bg-border absolute top-4 bottom-[-24px]"></div>}
                    </div>
                    
                    <div className="flex-1 pt-0.5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-semibold text-lg ${item.status === 'peak' ? 'text-destructive' : 'text-foreground'}`}>
                          {item.task}
                        </h4>
                        <Badge variant="secondary" className="flex items-center gap-1 bg-background border border-border">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {item.hours}h
                        </Badge>
                      </div>
                      {item.status === 'current' && (
                        <Button size="sm" className="mt-2 bg-primary hover:bg-primary-hover text-white shadow-sm">
                          Start Session
                        </Button>
                      )}
                      {item.status === 'peak' && (
                        <p className="text-sm text-destructive/80 mt-1 flex items-center gap-1">
                          <Target className="w-3 h-3" /> Heavy workload day. Ensure you rest well prior.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
