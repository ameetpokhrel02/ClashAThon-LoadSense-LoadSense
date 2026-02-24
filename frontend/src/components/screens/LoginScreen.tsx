import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, BookOpen, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { handleApiError } from "@/lib/api"

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Mock API call for Hackathon MVP
      // const response = await api.post('/auth/login', { email, password })
      // setAuth(response.data.user, response.data.token)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock successful login
      setAuth(
        { id: '1', firstName: 'Alex', lastName: 'Student', email },
        'mock-jwt-token-123'
      )
      onLogin()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Mock API call for Hackathon MVP
      // const response = await api.post('/auth/register', { firstName, lastName, email, password })
      // setAuth(response.data.user, response.data.token)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAuth(
        { id: '1', firstName, lastName, email },
        'mock-jwt-token-123'
      )
      onLogin()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#FFF8F5] via-[#FFF5F0] to-[#FFEDE5]">
      {/* Left Panel - Illustration & Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#ff7400] via-[#ff8c33] to-[#e66800] p-12 text-white relative overflow-hidden">
        {/* Subtle glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />
        
        <div className="flex items-center gap-2 relative z-10">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/10 glow-primary">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">LoadSense</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto relative z-10">
          {/* Glass card illustration */}
          <div className="w-full aspect-square glass-card-dark rounded-2xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl glow-primary">
            <div className="text-center">
              <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-90" />
              <p className="text-lg font-medium opacity-90">Smart Workload Management</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight gradient-text">
            Master your academic schedule.
          </h1>
          <p className="text-lg text-white/80">
            Detect workload peaks, plan smarter, and avoid burnout with intelligent deadline tracking.
          </p>
        </div>
        
        <div className="text-sm text-white/60 relative z-10">
          © 2026 LoadSense. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-r from-[#ff7400] to-[#ff8c33] p-2 rounded-lg glow-primary">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight gradient-text-primary">LoadSense</span>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#FFF5F0] border border-[#FFE8D6]">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="card-premium border border-[#E2E8F0]">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-semibold text-[#0F172A]">Welcome back</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</div>}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="student@university.edu" 
                        className="rounded-lg input-soft" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm text-[#ff7400] hover:underline">Forgot password?</a>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        className="rounded-lg input-soft" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button className="w-full rounded-lg mt-2 btn-primary-glow" size="lg" type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="card-premium border border-[#E2E8F0]">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-[#0F172A]">Create an account</CardTitle>
                  <CardDescription>
                    Start managing your academic workload intelligently.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</div>}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input 
                          id="first-name" 
                          placeholder="Jane" 
                          className="rounded-lg" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input 
                          id="last-name" 
                          placeholder="Doe" 
                          className="rounded-lg" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">University Email</Label>
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="student@university.edu" 
                        className="rounded-lg" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input 
                        id="reg-password" 
                        type="password" 
                        className="rounded-lg" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button className="w-full rounded-lg mt-2" size="lg" type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
