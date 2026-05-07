"use client";

import React, { useEffect, useState } from "react";
import { getStudents, StudentProfile } from "@/services/student.service";

export default function TutorStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);

      const res = await getStudents();

      if (res.error) {
        setError(res.error);
        setStudents([]);
      } else {
        setStudents(res.data || []);
      }

      setLoading(false);
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-6">Loading students...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Students</h1>

      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">
                {student.user.name}
              </h2>

              <p className="text-sm text-gray-600">
                Email: {student.user.email}
              </p>

              {student.class && (
                <p className="text-sm">Class: {student.class}</p>
              )}

              {student.group && (
                <p className="text-sm">Group: {student.group}</p>
              )}

              {student.address && (
                <p className="text-sm">Address: {student.address}</p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                Status: {student.user.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
