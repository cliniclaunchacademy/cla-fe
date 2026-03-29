"use client";

import { getUserDetails } from '@api/ApiAuth';
import Loader from '@common/Loader';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function UserProfile({}) {
  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", "userDetails"],
    queryFn: getUserDetails,
    select: (res) => res.data.data,
  });
  console.log(userDetails);

  // if(!userDetails){
  //   return <p>No user details available.</p>;
  // }

  return (
    <Loader isLoading={isLoading}>
      <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-2xl shadow border">
        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">User Information</h2>

        {/* User Info List */}
        <div className="space-y-3">

          {/* Username */}
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Username</span>
            <span className="font-medium">{userDetails?.username}</span>
          </div>

          {/* Email */}
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{userDetails?.email}</span>
          </div>

          {/* Role */}
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">{userDetails?.role}</span>
          </div>

          {/* Created At */}
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Created At</span>
            <span className="font-medium">
              {new Date(userDetails?.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Updated At */}
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Updated At</span>
            <span className="font-medium">
              {new Date(userDetails?.updatedAt).toLocaleString()}
            </span>
          </div>

          {/* ID */}
          <div className="flex justify-between">
            <span className="text-gray-500">User ID</span>
            <span className="font-medium">{userDetails?._id}</span>
          </div>
        </div>
      </div>
    </Loader>
  )
}