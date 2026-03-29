"use client";
import { createUser } from "@api/ApiAuth";
import { getAllCourses } from "@api/ApiCourse";
import Loader from "@common/Loader";
import AdminForm from "@components/Dashboard/User/AdminForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AddUser() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    data: courseList,
    isLoading: courseListLoading,
    isError,
    error,
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

  console.log(courseList);

  const { mutateAsync: addUserMutation } = useMutation({
    mutationFn: createUser,
    onError: (error) => { },
    onSuccess: () => { },
  });

  const handleAddedAdmin = async ({ data, reset }) => {
    console.log(data);
    try {
      setLoading(true);
      const response = await addUserMutation(data);
      reset();
      Swal.fire({
        title: "Success",
        text: "Admin added successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/dashboard/users");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error adding admin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 px-10">
      <h6 className="textHeading28 text-[#1E453C] mb-[56px]">Add User</h6>
      <Loader isLoading={loading || courseListLoading}>
        <AdminForm
          onSubmit={handleAddedAdmin}
          props={{ courseList }}
        />
      </Loader>
    </section>
  );
}
