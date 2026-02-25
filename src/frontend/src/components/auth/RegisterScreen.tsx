import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Lock, User, ArrowLeft, BookOpen, Pencil, Eye, EyeOff } from "lucide-react"
import { api, handleApiError } from "@/lib/api"
import childrenImage from "@/assets/childenjooying-Photoroom.png"
import logo from "@/assets/logo.png"

interface RegisterScreenProps {
  onRegister: () => void
  onNavigate: (screen: string) => void
}

export default function RegisterScreen({ onRegister, onNavigate }: RegisterScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password
      })
      // Registration successful - navigate to login instead of auto-login
      onRegister()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-gray-950">
      {/* Left Panel - Modern Hero */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-[#F8FAFB] via-[#F5F7F8] to-[#EEF2F5] dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 opacity-40">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="w-12 h-12 text-[#ff7400]/30" />
          </motion.div>
        </div>
        <div className="absolute top-32 right-16 opacity-30">
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Pencil className="w-8 h-8 text-[#ff7400]/40" />
          </motion.div>
        </div>
        <div className="absolute bottom-40 left-16 opacity-30">
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <BookOpen className="w-10 h-10 text-[#ff7400]/20" />
          </motion.div>
        </div>

        {/* Logo */}
        <motion.div
          className="p-8 flex items-center relative z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logo} alt="LoadSense Logo" className="h-12 w-auto" />
        </motion.div>

        {/* Hero Image - Large & Centered with Orange Glow */}
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-8">
          <motion.div
            className="w-full max-w-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Soft shadow underneath */}
            <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-transparent to-gray-900/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gray-900/15 dark:bg-black/30 blur-xl rounded-full" />

            {/* Main Image */}
            <div className="relative">
              <img
                src={childrenImage}
                alt="Students enjoying learning"
                className="w-full h-auto relative z-10 object-contain scale-110"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))' }}
              />
            </div>

            {/* Text Below Image */}
            <motion.div
              className="text-center mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#1a1a2e]">Join</span>{" "}
                <img src={logo} alt="LoadSense" className="h-10 w-auto inline-block align-middle mb-1" />
              </h1>
              <p className="text-[#64748B] text-lg">
                Start your academic journey.
              </p>
            </motion.div>
          </motion.div>
        </div>

        <div className="p-8 text-sm text-[#64748B] relative z-10">
          © 2026 LoadSense. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto bg-white dark:bg-gray-950">
        <motion.div
          className="w-full max-w-md"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <img src={logo} alt="LoadSense Logo" className="h-12 w-auto" />
          </div>

          <Card className="bg-white dark:bg-gray-900 shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 rounded-3xl">
            <CardHeader className="space-y-2 pb-6 pt-10 px-10">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Start managing your academic workload intelligently.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-10 pb-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#ff7400] focus:ring-[#ff7400]/20 transition-all"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#ff7400] focus:ring-[#ff7400]/20 transition-all"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">University Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.edu"
                      className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#ff7400] focus:ring-[#ff7400]/20 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      className="pl-12 pr-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#ff7400] focus:ring-[#ff7400]/20 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff7400] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-12 pr-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-[#ff7400] focus:ring-[#ff7400]/20 transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff7400] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full h-14 rounded-xl text-base font-semibold bg-[#ff7400] hover:bg-[#e66800] text-white shadow-lg shadow-[#ff7400]/25 transition-all duration-300"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
                </Button>
              </form>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400">Already have an account?</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('login')}
                className="w-full h-14 rounded-xl text-base font-semibold border-2 border-[#ff7400] text-[#ff7400] hover:bg-[#ff7400]/5 dark:hover:bg-[#ff7400]/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
