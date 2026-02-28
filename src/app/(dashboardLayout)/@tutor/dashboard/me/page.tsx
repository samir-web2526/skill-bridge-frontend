import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/services/user.service";
import React from "react";

export default async function TutorProfile() {

  const profile = await getUser();
  console.log(profile);
 
  return (
    <div>
      <Card className="max-w-4xl mx-auto mt-10 p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      
      {/* Left: Avatar + Name + Phone */}
      <div className="flex flex-col items-center sm:items-start w-full sm:w-1/3">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarImage
            src={
              profile.image ||
              "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt={profile.name}
          />
        </Avatar>
       
      </div>

      {/* Right: Other Info */}
      <CardContent className="flex-1 flex flex-col justify-center w-full sm:w-2/3">
       <h2 className="text-2xl font-bold">{profile.name}</h2>
        {profile.phone && <p className="text-gray-600">📞 {profile.phone}</p>}
        <p className="text-gray-600 mb-1">✉️ {profile.email}</p>
        <p className="text-gray-600 mb-1">Status: {profile.status}</p>
        <p className="text-gray-600">Role: {profile.role}</p>
      </CardContent>

    </Card>
    </div>
  );
}
