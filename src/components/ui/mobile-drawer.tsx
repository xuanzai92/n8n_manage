'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface MobileDrawerProps {
  children: React.ReactNode
  trigger?: React.ReactNode
}

export function MobileDrawer({ children, trigger }: MobileDrawerProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        {children}
      </SheetContent>
    </Sheet>
  )
}