'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Paintbrush, LineChart, Briefcase, FileEdit, HelpCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import JobList from '@/components/job-list'

interface NavbarProps {
  onJobMatchingClick: () => void;
}

export default function Navbar({ onJobMatchingClick }: NavbarProps) {
  const pathname = usePathname()
  const currentTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const navItems = [
    {
      label: 'Preview',
      icon: FileText,
      href: '/preview',
      active: pathname === '/preview'
    },
    {
      label: 'Design',
      icon: Paintbrush,
      href: '/design',
      active: pathname === '/design'
    },
    {
      label: 'Analysis',
      icon: LineChart,
      href: '/analysis',
      active: pathname === '/analysis',
      badge: '12'
    },
    {
      label: 'Job Matching',
      icon: Briefcase,
      href: '/jobs',
      active: pathname === '/jobs',
      alert: true
    },
    {
      label: 'Cover Letter',
      icon: FileEdit,
      href: '/cover-letter',
      active: pathname === '/cover-letter'
    },
    {
      label: 'Guidance',
      icon: HelpCircle,
      href: '/guidance',
      active: pathname === '/guidance'
    }
  ]

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col gap-4 py-4">
        <div className="flex items-center gap-2 text-lg font-semibold ml-4">
          <span>my resume</span>
          <span className="text-sm font-normal text-muted-foreground">- {currentTime}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 ml-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={item.active ? "default" : "ghost"}
              className={cn(
                "h-9 gap-2 rounded-full",
                item.active && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              asChild
            >
              {item.label === "Job Matching" ? (
                <span onClick={() => onJobMatchingClick()} style={{ cursor: "pointer" }}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="rounded-full px-2 py-0.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {item.alert && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </span>
              ) : (
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="rounded-full px-2 py-0.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {item.alert && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </Link>
              )}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}

