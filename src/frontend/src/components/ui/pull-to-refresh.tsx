import { motion } from "framer-motion"
import { RefreshCw, ArrowDown } from "lucide-react"
import { usePullToRefresh } from "@/hooks/useMobileGestures"

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  disabled = false, 
  className = "" 
}: PullToRefreshProps) {
  const { isPulling, pullDistance, isRefreshing, shouldTrigger } = usePullToRefresh({
    onRefresh,
    disabled
  })

  return (
    <div className={`relative ${className}`}>
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-10"
        initial={{ y: -60, opacity: 0 }}
        animate={{ 
          y: isPulling ? Math.min(pullDistance - 60, 20) : -60,
          opacity: isPulling ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 flex items-center gap-2 modern-shadow">
          <motion.div
            animate={{ 
              rotate: isRefreshing ? 360 : shouldTrigger ? 180 : 0,
              scale: shouldTrigger ? 1.1 : 1
            }}
            transition={{ 
              rotate: { duration: isRefreshing ? 1 : 0.3, repeat: isRefreshing ? Infinity : 0, ease: "linear" },
              scale: { duration: 0.2 }
            }}
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 text-primary" />
            ) : (
              <ArrowDown className="w-4 h-4 text-primary" />
            )}
          </motion.div>
          <span className="text-sm font-medium text-foreground">
            {isRefreshing ? 'Refreshing...' : shouldTrigger ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        animate={{ 
          y: isPulling ? Math.min(pullDistance * 0.5, 40) : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  )
}