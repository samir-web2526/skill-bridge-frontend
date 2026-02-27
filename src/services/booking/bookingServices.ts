
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const createBooking = async (payload: any, userId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/bookings`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        userId,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("Booking error:", error)
      return null
    }

    return await res.json()
  } catch (error) {
    console.error(error)
    return null
  }
}