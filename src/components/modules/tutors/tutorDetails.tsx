

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { createBooking } from "@/services/booking.service"
import { getUser } from "@/services/user.service"

interface TutorDetailCardProps {
  id: string
  name: string
  bio: string
  subject: string
  rating: number
  hourlyRate: number
  image?: string
}

export default function TutorDetailCard({
  id,
  name,
  bio,
  subject,
  rating,
  hourlyRate,
  image,
}: TutorDetailCardProps) {

  const handleBooking = async () => {
    const user = await getUser()

    if (!user) {
      alert("Please login first")
      return
    }

    const payload = {
      tutorId: id,
      userId: user.id,
      date: new Date(),
    }

    console.log(payload.tutorId)

    const booking = await createBooking(payload, user.id)

    if (booking) {
      console.log("Booking successful")
      alert("Booking successful!")
    } else {
      console.log("Booking failed")
      alert("Booking failed")
    }
  }

  return (
    <Card className="max-w-4xl mx-auto rounded-2xl shadow-md">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

        <div className="flex justify-center items-center">
          <Avatar className="h-48 w-48">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{name}</h2>

          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{subject}</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {bio || "No bio available"}
          </p>

          <div className="flex gap-2">
            <Badge>Rating: {rating?.toFixed(1)}</Badge>
            <Badge>Hourly: ${hourlyRate}</Badge>
          </div>

          <Button onClick={handleBooking} className="w-full mt-4">
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}