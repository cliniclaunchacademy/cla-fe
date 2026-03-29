"use client";

import React, { use, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@common/Loader.jsx";
import NotFound from "@common/NotFound";
import AdminForm from "@components/Dashboard/User/AdminForm";
import { getUserById, updateUser } from "@api/ApiAuth";
import { getAllCourses } from "@api/ApiCourse";
import Swal from "sweetalert2";

export default function EditAdmin({ params }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  //get by id
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "",
      {
        id,
      },
    ],
    queryFn: getUserById,
    select: (res) => res.data.data,
  });

  const {
    data: courseList,
    isLoading: courseListLoading,
    isError: isCourseListError,
    error: courseListError,
  } = useQuery({
    queryKey: [
      "courses",
      {
        page: 1,
        limit: 100,
        search: "",
        sortBy: "createdAt",
        order: "asc",
      },
    ],
    queryFn: getAllCourses,
    select: (res) =>
      res.data.data.courses.map((course) => ({
        label: course.title,
        value: course._id,
      })),
  });

  //update part
  const { mutateAsync: updateUserMutation } = useMutation({
    mutationFn: updateUser,
    onError: (error) => {},
    onSuccess: () => {
      // Refresh after update
      queryClient.invalidateQueries({ queryKey: [""] });
    },
  });

  const handleUpdateUser = async ({ data }) => {
    console.log("Update Data:", data);
    try {
      setLoading(true);
      const response = await updateUserMutation({ id, payload: data });
      Swal.fire({
        title: "Success",
        text: "User updated successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updated user:", error);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // error part
  if (isError || !id) {
    return <NotFound>Not found</NotFound>;
  }

  return (
    <section className="py-6 px-10">
      <h6 className="textHeading28 text-[#1E453C] mb-[56px]">Edit Admin</h6>
      <Loader isLoading={isLoading || loading || courseListLoading}>
        <AdminForm
          user={user}
          onSubmit={handleUpdateUser}
          isEdit={true}
          props={{ courseList }}
        />
      </Loader>
    </section>
  );
}
