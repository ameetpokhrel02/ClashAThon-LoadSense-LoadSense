import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut, AlertTriangle } from "lucide-react"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LogoutDialog({ open, onOpenChange, onConfirm }: LogoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-8">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ff7400]/10">
            <AlertTriangle className="h-7 w-7 text-[#ff7400]" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Are you sure you want to logout?
          </DialogTitle>
          <DialogDescription className="text-base text-gray-500 dark:text-gray-400">
            You will be signed out of your account and redirected to the login screen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-4 sm:gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="flex-1 h-12 rounded-xl gap-2 bg-[#ff7400] hover:bg-[#e66800] text-white"
          >
            <LogOut className="h-4 w-4" />
            Yes, Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}