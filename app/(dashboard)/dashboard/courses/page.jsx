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
          <p className="text-[#663F7E] textLabel16">Course</p>
        </div>
      </div>
      <div className="w-full bg-[#FFFAFA] rounded-[4px] p-4 ">
        <div className="flex justify-between">
          <h3 className="text-[#000000] merriweather textHeading28 !font-bold ">Course</h3>
          <Link
            href="/dashboard/courses/addEditCourse"
            className="w-fit flex items-center gap-2.5 py-3 px-2.5 rounded-[10px] bg-[linear-gradient(270deg,_#B48E2C_0%,_#E8C75C_23.08%,_#F7EF8A_36.54%,_#EDD670_55.77%,_#EAC665_90.38%,_#DAB145_100%)] ">
            <span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0833 19.25V11.9167H2.75V10.0833H10.0833V2.75H11.9167V10.0833H19.25V11.9167H11.9167V19.25H10.0833Z" fill="#484848" />
              </svg>
            </span>
            <span className="text-[#484848] textLabel16 ">
              Add Course
            </span>
          </Link>
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
        <div className="my-6 ">
          <Table className="text-[#737272] ">
            <TableHeader>
              <TableRow className="bg-[#EDEDED] textLabel14 uppercase tracking-wider ">
                <TableHead>COURSE ID</TableHead>
                <TableHead>COURSE NAME</TableHead>
                <TableHead>LECTURES</TableHead>
                <TableHead>UPDATED ON</TableHead>
                <TableHead>ENROLLED</TableHead>
                <TableHead>PUBLISH</TableHead>
                <TableHead>Action</TableHead>
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

              {paymentList?.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-b border-[#C4C4C4] textBody16"
                >
                  <TableCell>{user.courseId}</TableCell>
                  <TableCell>{user.courseName}</TableCell>
                  <TableCell>{user.lectures}</TableCell>
                  <TableCell>{user.uploadedOn}</TableCell>
                  <TableCell>{user.enrolled}</TableCell>
                  <TableCell>
                    <ToggleSwitch />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
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
    </section>
  );
}
