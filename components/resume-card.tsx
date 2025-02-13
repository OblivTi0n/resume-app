import { PenLine, Fingerprint, Download, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ResumeCardProps {
  title: string
  subtitle: string
  lastEdited: string
  isSelected?: boolean
}

export function ResumeCard({ title, subtitle, lastEdited, isSelected }: ResumeCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all ${isSelected ? 'border-primary shadow-lg' : ''}`}>
      <CardContent className="p-6">
        <div className="mb-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DnMSQdzY2qgNT5QvRePpymfbFVYDJE.png"
            alt="Resume preview"
            width={200}
            height={280}
            className="w-full border rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <PenLine className="w-4 h-4" />
            Edit Resume
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4" />
            Tailor to Job
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">Classic</Badge>
          <Badge variant="outline">Light</Badge>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-muted/50 text-sm text-muted-foreground">
        Last Edited: {lastEdited}
      </CardFooter>
    </Card>
  )
}

