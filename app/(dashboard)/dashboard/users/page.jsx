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

const PasswordDisplay = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
  const spanRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 2); // +2 for small buffer
    }
  }, [password, showPassword]);

  return (
    <div className="flex items-center gap-4">
      {/* Hidden span for measuring width */}
      <span
        ref={spanRef}
        className="absolute invisible whitespace-pre"
      >
        {showPassword ? password : "•••"}
      </span>

      {/* Input with dynamic width */}
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        className="min-w-[56px] bg-transparent border-none p-0 outline-none"
        style={{ width: inputWidth }}
        disabled
      />

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className={`w-[30px] h-[30px] flex items-center justify-center py-2 rounded-full transition duration-200 hover:bg-[#45A08B]/20 `}>
        {
          showPassword ?
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.1 13.3L14.65 11.85C14.8 11.0667 14.575 10.3333 13.975 9.65C13.375 8.96667 12.6 8.7 11.65 8.85L10.2 7.4C10.4833 7.26667 10.7708 7.16667 11.0625 7.1C11.3542 7.03334 11.6667 7 12 7C13.25 7 14.3125 7.4375 15.1875 8.3125C16.0625 9.1875 16.5 10.25 16.5 11.5C16.5 11.8333 16.4667 12.1458 16.4 12.4375C16.3333 12.7292 16.2333 13.0167 16.1 13.3ZM19.3 16.45L17.85 15.05C18.4833 14.5667 19.0458 14.0375 19.5375 13.4625C20.0292 12.8875 20.45 12.2333 20.8 11.5C19.9667 9.81667 18.7708 8.47917 17.2125 7.4875C15.6542 6.49584 13.9167 6 12 6C11.5167 6 11.0417 6.03334 10.575 6.1C10.1083 6.16667 9.65 6.26667 9.2 6.4L7.65 4.85C8.33333 4.56667 9.03333 4.35417 9.75 4.2125C10.4667 4.07084 11.2167 4 12 4C14.5167 4 16.7583 4.69584 18.725 6.0875C20.6917 7.47917 22.1167 9.28334 23 11.5C22.6167 12.4833 22.1125 13.3958 21.4875 14.2375C20.8625 15.0792 20.1333 15.8167 19.3 16.45ZM19.8 22.6L15.6 18.45C15.0167 18.6333 14.4292 18.7708 13.8375 18.8625C13.2458 18.9542 12.6333 19 12 19C9.48333 19 7.24167 18.3042 5.275 16.9125C3.30833 15.5208 1.88333 13.7167 1 11.5C1.35 10.6167 1.79167 9.79584 2.325 9.0375C2.85833 8.27917 3.46667 7.6 4.15 7L1.4 4.2L2.8 2.8L21.2 21.2L19.8 22.6ZM5.55 8.4C5.06667 8.83334 4.625 9.30834 4.225 9.825C3.825 10.3417 3.48333 10.9 3.2 11.5C4.03333 13.1833 5.22917 14.5208 6.7875 15.5125C8.34583 16.5042 10.0833 17 12 17C12.3333 17 12.6583 16.9792 12.975 16.9375C13.2917 16.8958 13.6167 16.85 13.95 16.8L13.05 15.85C12.8667 15.9 12.6917 15.9375 12.525 15.9625C12.3583 15.9875 12.1833 16 12 16C10.75 16 9.6875 15.5625 8.8125 14.6875C7.9375 13.8125 7.5 12.75 7.5 11.5C7.5 11.3167 7.5125 11.1417 7.5375 10.975C7.5625 10.8083 7.6 10.6333 7.65 10.45L5.55 8.4Z" fill="#9C9C9C" />
            </svg>

            :
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1875 14.6875C16.0625 13.8125 16.5 12.75 16.5 11.5C16.5 10.25 16.0625 9.1875 15.1875 8.3125C14.3125 7.4375 13.25 7 12 7C10.75 7 9.6875 7.4375 8.8125 8.3125C7.9375 9.1875 7.5 10.25 7.5 11.5C7.5 12.75 7.9375 13.8125 8.8125 14.6875C9.6875 15.5625 10.75 16 12 16C13.25 16 14.3125 15.5625 15.1875 14.6875ZM10.0875 13.4125C9.5625 12.8875 9.3 12.25 9.3 11.5C9.3 10.75 9.5625 10.1125 10.0875 9.5875C10.6125 9.0625 11.25 8.8 12 8.8C12.75 8.8 13.3875 9.0625 13.9125 9.5875C14.4375 10.1125 14.7 10.75 14.7 11.5C14.7 12.25 14.4375 12.8875 13.9125 13.4125C13.3875 13.9375 12.75 14.2 12 14.2C11.25 14.2 10.6125 13.9375 10.0875 13.4125ZM5.35 16.9625C3.35 15.6042 1.9 13.7833 1 11.5C1.9 9.21667 3.35 7.39583 5.35 6.0375C7.35 4.67917 9.56667 4 12 4C14.4333 4 16.65 4.67917 18.65 6.0375C20.65 7.39583 22.1 9.21667 23 11.5C22.1 13.7833 20.65 15.6042 18.65 16.9625C16.65 18.3208 14.4333 19 12 19C9.56667 19 7.35 18.3208 5.35 16.9625ZM17.1875 15.5125C18.7625 14.5208 19.9667 13.1833 20.8 11.5C19.9667 9.81667 18.7625 8.47917 17.1875 7.4875C15.6125 6.49583 13.8833 6 12 6C10.1167 6 8.3875 6.49583 6.8125 7.4875C5.2375 8.47917 4.03333 9.81667 3.2 11.5C4.03333 13.1833 5.2375 14.5208 6.8125 15.5125C8.3875 16.5042 10.1167 17 12 17C13.8833 17 15.6125 16.5042 17.1875 15.5125Z" fill="#9C9C9C" />
            </svg>
        }

      </button>
    </div>
  );
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (isError) return <p>Error: {error.message}</p>;

  return (
    <section className="p-4 ">
      <div className="w-full bg-[#FFFAFA] px-4 py-[2px] rounded-[4px] mb-2 ">
        <div className="flex items-center gap-2">
          <span className="">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1_202_2210" fill="white">
                <path d="M0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14Z" />
              </mask>
              <path d="M0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14Z" fill="#663F7E" />
              <g clip-path="url(#paint0_diamond_202_2210_clip_path)" data-figma-skip-parse="true" mask="url(#path-1-inside-1_202_2210)"><g transform="matrix(0.00824658 -2.47048e-09 2.47048e-09 0.0488289 14 14)"><rect x="0" y="0" width="1843.19" height="311.291" fill="url(#paint0_diamond_202_2210)" opacity="1" shape-rendering="crispEdges" /><rect x="0" y="0" width="1843.19" height="311.291" transform="scale(1 -1)" fill="url(#paint0_diamond_202_2210)" opacity="1" shape-rendering="crispEdges" /><rect x="0" y="0" width="1843.19" height="311.291" transform="scale(-1 1)" fill="url(#paint0_diamond_202_2210)" opacity="1" shape-rendering="crispEdges" /><rect x="0" y="0" width="1843.19" height="311.291" transform="scale(-1)" fill="url(#paint0_diamond_202_2210)" opacity="1" shape-rendering="crispEdges" /></g></g><path d="M0 14M28 14M28 14M0 14M14 0M28 14M14 28M0 14M14 28V26.8C6.93076 26.8 1.2 21.0692 1.2 14H0H-1.2C-1.2 22.3947 5.60527 29.2 14 29.2V28ZM28 14H26.8C26.8 21.0692 21.0692 26.8 14 26.8V28V29.2C22.3947 29.2 29.2 22.3947 29.2 14H28ZM14 0V1.2C21.0692 1.2 26.8 6.93076 26.8 14H28H29.2C29.2 5.60527 22.3947 -1.2 14 -1.2V0ZM14 0V-1.2C5.60527 -1.2 -1.2 5.60527 -1.2 14H0H1.2C1.2 6.93076 6.93076 1.2 14 1.2V0Z" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_DIAMOND&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.89999991655349731,&#34;g&#34;:0.88302719593048096,&#34;b&#34;:0.70269209146499634,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.89769983291625977,&#34;g&#34;:0.78575736284255981,&#34;b&#34;:0.47298747301101685,&#34;a&#34;:1.0},&#34;position&#34;:0.15865384042263031},{&#34;color&#34;:{&#34;r&#34;:0.83461540937423706,&#34;g&#34;:0.64210295677185059,&#34;b&#34;:0.34989652037620544,&#34;a&#34;:1.0},&#34;position&#34;:0.31730768084526062},{&#34;color&#34;:{&#34;r&#34;:0.91372549533843994,&#34;g&#34;:0.74509805440902710,&#34;b&#34;:0.37254902720451355,&#34;a&#34;:1.0},&#34;position&#34;:0.70673078298568726},{&#34;color&#34;:{&#34;r&#34;:0.97647058963775635,&#34;g&#34;:0.92549020051956177,&#34;b&#34;:0.72156864404678345,&#34;a&#34;:1.0},&#34;position&#34;:0.85336542129516602},{&#34;color&#34;:{&#34;r&#34;:0.94901961088180542,&#34;g&#34;:0.82745099067687988,&#34;b&#34;:0.52549022436141968,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.89999991655349731,&#34;g&#34;:0.88302719593048096,&#34;b&#34;:0.70269209146499634,&#34;a&#34;:1.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.89769983291625977,&#34;g&#34;:0.78575736284255981,&#34;b&#34;:0.47298747301101685,&#34;a&#34;:1.0},&#34;position&#34;:0.15865384042263031},{&#34;color&#34;:{&#34;r&#34;:0.83461540937423706,&#34;g&#34;:0.64210295677185059,&#34;b&#34;:0.34989652037620544,&#34;a&#34;:1.0},&#34;position&#34;:0.31730768084526062},{&#34;color&#34;:{&#34;r&#34;:0.91372549533843994,&#34;g&#34;:0.74509805440902710,&#34;b&#34;:0.37254902720451355,&#34;a&#34;:1.0},&#34;position&#34;:0.70673078298568726},{&#34;color&#34;:{&#34;r&#34;:0.97647058963775635,&#34;g&#34;:0.92549020051956177,&#34;b&#34;:0.72156864404678345,&#34;a&#34;:1.0},&#34;position&#34;:0.85336542129516602},{&#34;color&#34;:{&#34;r&#34;:0.94901961088180542,&#34;g&#34;:0.82745099067687988,&#34;b&#34;:0.52549022436141968,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:16.493150711059570,&#34;m01&#34;:4.9409600251237862e-06,&#34;m02&#34;:5.7534222602844238,&#34;m10&#34;:-4.9409600251237862e-06,&#34;m11&#34;:97.657768249511719,&#34;m12&#34;:-34.828880310058594},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}" mask="url(#path-1-inside-1_202_2210)" />
              <path d="M12.333 19L7.33301 14L12.333 9L13.4997 10.2083L10.5413 13.1667H20.6663V14.8333H10.5413L13.4997 17.7917L12.333 19Z" fill="#FFFAFA" />
              <defs>
                <clipPath id="paint0_diamond_202_2210_clip_path"><path d="M0 14M28 14M28 14M0 14M14 0M28 14M14 28M0 14M14 28V26.8C6.93076 26.8 1.2 21.0692 1.2 14H0H-1.2C-1.2 22.3947 5.60527 29.2 14 29.2V28ZM28 14H26.8C26.8 21.0692 21.0692 26.8 14 26.8V28V29.2C22.3947 29.2 29.2 22.3947 29.2 14H28ZM14 0V1.2C21.0692 1.2 26.8 6.93076 26.8 14H28H29.2C29.2 5.60527 22.3947 -1.2 14 -1.2V0ZM14 0V-1.2C5.60527 -1.2 -1.2 5.60527 -1.2 14H0H1.2C1.2 6.93076 6.93076 1.2 14 1.2V0Z" mask="url(#path-1-inside-1_202_2210)" /></clipPath><linearGradient id="paint0_diamond_202_2210" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E5E1B3" />
                  <stop offset="0.158654" stop-color="#E5C879" />
                  <stop offset="0.317308" stop-color="#D5A459" />
                  <stop offset="0.706731" stop-color="#E9BE5F" />
                  <stop offset="0.853365" stop-color="#F9ECB8" />
                  <stop offset="1" stop-color="#F2D386" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="">
            <svg width="5" height="17" viewBox="0 0 5 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.59082 15.5913L3.70813 0.591278" stroke="#C4C4C4" stroke-linecap="square" />
            </svg>
          </span>
          <p className="text-[#663F7E] textLabel16">Users</p>
        </div>
      </div>
      <div className="w-full bg-[#FFFAFA] rounded-[4px] p-4 ">
        <div className="flex justify-between">
          <h3 className="text-[#000000] merriweather textHeading28 !font-bold ">Users</h3>
          <button
            onClick={() => toggleModal()}
            className="w-fit flex items-center gap-2.5 py-3 px-2.5 rounded-[10px] bg-[linear-gradient(270deg,_#B48E2C_0%,_#E8C75C_23.08%,_#F7EF8A_36.54%,_#EDD670_55.77%,_#EAC665_90.38%,_#DAB145_100%)] ">

            <span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0833 19.25V11.9167H2.75V10.0833H10.0833V2.75H11.9167V10.0833H19.25V11.9167H11.9167V19.25H10.0833Z" fill="#484848" />
              </svg>
            </span>
            <span className="text-[#484848] textLabel16 ">
              Add User
            </span>
          </button>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-6 md:items-center pt-8 pb-6 ">
          {/* Search */}
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            onSubmit={() => { }}
          />

          {/* Sort */}
          <div className="flex items-center gap-4 ">
            <span className="redhat text-[#737272] textBody16">Sort by:</span>
            <DropdownSelect
              filters={[
                { key: "createdAt", label: "Created at" },
              ]}
              onChange={(val) => setSortBy(val)}
            />
          </div>

          {/* Order */}
          <div className="flex items-center gap-4">
            <span className="redhat text-[#737272] textBody16">Order by:</span>
            <DropdownSelect
              filters={[
                { key: "asc", label: "Ascending" },
                { key: "desc", label: "Descending" },
              ]}
              onChange={(val) => setOrder(val)}
            />
          </div>
        </div>

        {/* Pagination */}
        {/* <Pagination page={page} setPage={setPage} totalPages={totalPages} /> */}

        {/* Table */}
        <div className="my-6">
          <Table className="text-[#737272] ">
            <TableHeader>
              <TableRow className="bg-[#EDEDED] textLabel14 uppercase tracking-wider ">
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>COURSE</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Loader isLoading={true} />
                  </TableCell>
                </TableRow>
              )}

              {userList?.users.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-b border-[#C4C4C4] textBody16"
                >
                  <TableCell>{user.username || "-"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    {user.role === "admin" && (
                      // <span className="text-red-500 border border-red-500 rounded-full px-2 py-1">
                      //   {user.role}
                      // </span>
                      <span className="bg-[#F5FFD3] py-[2px] px-2 rounded-[5px] textLabel16 text-[#87A32A] ">
                        Admin
                      </span>
                    )}
                    {user.role === "student" && (
                      <span className="bg-[#FFEBF2] py-[2px] px-2 rounded-[5px] textLabel16 text-[#C61358] ">
                        Student
                      </span>
                      // <span className="text-yellow-500 border border-yellow-500 rounded-full px-2 py-1">
                      //   {user.role}
                      // </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <PasswordDisplay password={user.password} />
                  </TableCell>
                  <TableCell>
                    <DropdownTableColumn
                      filters={[
                        { key: "1", label: "MRCOG Part 1" },
                        { key: "2", label: "MRCOG Part 2" },
                      ]}
                      onChange={(val) => { }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      {/* Edit Button */}
                      <div className="relative group">
                        <button
                          onClick={() => toggleModal()}
                          className="py-1.5 px-2 textLabel14 text-[#663F7E] border-[2px] border-[#663F7E] hover:border-[#351D44] rounded-[8px] flex items-center justify-center gap-2 group "
                        >
                          <span className="text-[#663F7E] group-hover:text-[#351D44] ">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.16667 15.8333H5.35417L13.5 7.6875L12.3125 6.5L4.16667 14.6458V15.8333ZM2.5 17.5V13.9583L13.5 2.97917C13.6667 2.82639 13.8507 2.70833 14.0521 2.625C14.2535 2.54167 14.4653 2.5 14.6875 2.5C14.9097 2.5 15.125 2.54167 15.3333 2.625C15.5417 2.70833 15.7222 2.83333 15.875 3L17.0208 4.16667C17.1875 4.31944 17.309 4.5 17.3854 4.70833C17.4618 4.91667 17.5 5.125 17.5 5.33333C17.5 5.55556 17.4618 5.76736 17.3854 5.96875C17.309 6.17014 17.1875 6.35417 17.0208 6.52083L6.04167 17.5H2.5ZM12.8958 7.10417L12.3125 6.5L13.5 7.6875L12.8958 7.10417Z" fill="currentColor" />
                            </svg>
                          </span>

                          <span className="text-[#663F7E] group-hover:text-[#351D44]">Edit</span>
                        </button>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap z-10">
                          Edit
                        </div>
                      </div>
                      {/* Delete Button */}
                      <div className="relative group">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className=""
                        >
                          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="#9C9C9C" />
                          </svg>
                        </button>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap z-10">
                          Delete
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => toggleModal()}
        title="Add User"
      >
        <AdminForm props={{
          courseList: [
            { label: 'MRCOG Part 1', value: '6997e3b2063d626e7856d10a' },
            { label: 'MRCOG Part 2', value: '6997e3b2063d626e7856d10b' },
          ]
        }} />
      </Modal>
    </section>
  );
}
