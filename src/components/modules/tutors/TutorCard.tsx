
"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, BookOpen } from "lucide-react"

interface TutorCardProps {
  id: string
  name: string
  subject: string
  location: string
  rating: number
  pricePerHour: number
  image?: string
}

export default function TutorCard({
  id,
  name,
  subject,
  location,
  rating,
  pricePerHour,
  image,
}: TutorCardProps) {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md hover:shadow-lg transition">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <h3 className="mt-4 text-lg font-semibold">{name}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{subject}</span>
        </div>

        <Badge className="mt-3" variant="secondary">
          ${pricePerHour}/hr
        </Badge>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-1 text-foreground">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{rating?.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/tutors/${id}`} className="w-full">
          <Button className="w-full rounded-xl">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}