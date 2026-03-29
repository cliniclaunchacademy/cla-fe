"use client";
import DeleteIcon from "@assets/icons/DashboardIcon/DeleteIcon";
import EditIcon from "@assets/icons/DashboardIcon/EditIcon";
import DropdownSelect from "@common/DropdownSelect";
import Loader from "@common/Loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchInput from "@common/FormFieldComponent/SearchInput/SearchInput";
import Pagination from "@common/FormFieldComponent/Pagination/Pagination";
import { deleteUser, getAllUsers } from "@api/ApiAuth";
import { formatDate } from "@utils/date";
import AddButton from "@common/FormFieldComponent/AddButton/AddButton";
import DropdownTableColumn from "@common/DropdownTableColumn";
import Modal from "@common/Modal";
import FormFieldInput from "@common/FormFieldComponent/FormFieldInput/FormFieldInput";
import FormFieldSelect from "@common/FormFieldComponent/FormFieldSelect/FormFieldSelect";
import AdminForm from "@components/Dashboard/User/AdminForm";

export function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      <svg
        width="28"
        height="18"
        viewBox="0 0 22 12"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-200 ${isOn ? "text-[#25CA43]" : "text-gray-400"
          }`}
        fill="none"
      >
        <path
          d={
            isOn
              ? `M6 12C4.33333 12 2.91667 11.4167 1.75 10.25C0.583333 9.08333 0 7.66667 0 6C0 4.33333 0.583333 2.91667 1.75 1.75C2.91667 0.583333 4.33333 0 6 0H16C17.6667 0 19.0833 0.583333 20.25 1.75C21.4167 2.91667 22 4.33333 22 6C22 7.66667 21.4167 9.08333 20.25 10.25C19.0833 11.4167 17.6667 12 16 12H6ZM18.125 8.125C18.7083 7.54167 19 6.83333 19 6C19 5.16667 18.7083 4.45833 18.125 3.875C17.5417 3.29167 16.8333 3 16 3C15.1667 3 14.4583 3.29167 13.875 3.875C13.2917 4.45833 13 5.16667 13 6C13 6.83333 13.2917 7.54167 13.875 8.125C14.4583 8.70833 15.1667 9 16 9C16.8333 9 17.5417 8.70833 18.125 8.125Z`
              : `M6 12C4.33333 12 2.91667 11.4167 1.75 10.25C0.583333 9.08333 0 7.66667 0 6C0 4.33333 0.583333 2.91667 1.75 1.75C2.91667 0.583333 4.33333 0 6 0H16C17.6667 0 19.0833 0.583333 20.25 1.75C21.4167 2.91667 22 4.33333 22 6C22 7.66667 21.4167 9.08333 20.25 10.25C19.0833 11.4167 17.6667 12 16 12H6ZM8.125 8.125C8.70833 7.54167 9 6.83333 9 6C9 5.16667 8.70833 4.45833 8.125 3.875C7.54167 3.29167 6.83333 3 6 3C5.16667 3 4.45833 3.29167 3.875 3.875C3.29167 4.45833 3 5.16667 3 6C3 6.83333 3.29167 7.54167 3.875 8.125C4.45833 8.70833 5.16667 9 6 9C6.83333 9 7.54167 8.70833 8.125 8.125Z`
          }
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const queryClient = useQueryClient();

  // get all user
  const {
    data: userList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "users",
      {
        page: page,
        limit: 10,
        search: debouncedSearch,
        sortBy: sortBy,
        order: order,
      },
    ],
    queryFn: getAllUsers,
    select: (res) => res.data.data, // transform response
  });

  useEffect(() => {
    if (userList) {
      setTotalPages(userList.totalPages);
      setPage(userList.page);
    }
  }, [userList]);

  //delete part of user
  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onError: (error) => { },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDeleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;
    try {
      await deleteUserMutation(id);
      if (userList?.users?.length === 1 && page > 1) {
        setPage(page - 1); // go back one page
      }
      Swal.fire({
        title: "Success",
        text: "user deleted successfully!",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error deleted user:", error);
    }
  };

  // debouncedSearch 1s after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 1000);

    return () => clearTimeout(timer); // cleanup previous timer
  }, [searchTerm]);

  if (isError) return <p>Error: {error.message}</p>;

  const paymentList = [{
    courseId: "COU0001",
    courseName: "MRCOG Part 1",
    lectures: "42",
    uploadedOn: "15-12-25",
    enrolled: "42 Students",
  }]

  return (
    <section className="p-4 ">
      <h1>Courses</h1>
    </section>
  );
}
