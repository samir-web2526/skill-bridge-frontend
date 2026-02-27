"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { getUser } from "@/services/user.service";

export default function StudentProfileTable() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const res = await getUser();
      setProfile(res);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-10">Profile not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Profile</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Avatar */}
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.image || "https://randomuser.me/api/portraits/men/32.jpg"} />
                <AvatarFallback>👨‍🏫</AvatarFallback>
              </Avatar>
            </TableCell>
          </TableRow>

          {/* Name */}
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{profile.name || "N/A"}</TableCell>
          </TableRow>

          {/* Phone */}
          <TableRow>
            <TableCell>Phone</TableCell>
            <TableCell>{profile.phone || "N/A"}</TableCell>
          </TableRow>

          {/* Email */}
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>{profile.email || "N/A"}</TableCell>
          </TableRow>

          {/* Status */}
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>{profile.status || "N/A"}</TableCell>
          </TableRow>

          {/* Role */}
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>{profile.role || "N/A"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}