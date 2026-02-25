import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/store/themeStore"

interface ThemeToggleProps {
  variant?: 'icon' | 'full'
  className?: string
}

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, setTheme } = useThemeStore()

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  if (variant === 'full') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {themes.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={theme === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme(value)}
            className={`flex items-center gap-2 ${
              theme === value 
                ? 'bg-[#ff7400] hover:bg-[#e66800] text-white' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>
    )
  }

  // Cycle through themes on click
  const cycleTheme = () => {
    const order: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
    const currentIndex = order.indexOf(theme)
    const nextIndex = (currentIndex + 1) % order.length
    setTheme(order[nextIndex])
  }

  const CurrentIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className={`w-9 h-9 p-0 text-gray-600 dark:text-gray-400 hover:text-[#ff7400] hover:bg-[#ff7400]/10 ${className}`}
      title={`Theme: ${theme}`}
    >
      <CurrentIcon className="w-5 h-5" />
    </Button>
  )
}
