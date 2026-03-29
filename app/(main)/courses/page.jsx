"use client";

import courseImage from "@assets/images/eventImg.png";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@common/SearchBar";
import Pagination from "@common/FormFieldComponent/Pagination/Pagination";
import DropdownSelect from "@common/DropdownSelect";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@common/Loader";
import { getEnrollmentsByUser } from "@api/ApiEnrollment";

export default function Courses() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Fetch course
  const {
    data: enrolledCourses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "courses",
      {
        page,
        limit: 12,
        search: debouncedSearch,
        sortBy,
        order,
      },
    ],
    queryFn: getEnrollmentsByUser,
    select: (res) => res.data.data,
  });

  useEffect(() => {
    if (enrolledCourses) {
      setTotalPages(enrolledCourses.totalPages);
      setPage(enrolledCourses.page);
    }
  }, [enrolledCourses]);

  // Debounce search input: update after 1s of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 1000);

    return () => clearTimeout(timer); // cleanup on unmount or change
  }, [searchTerm]);

  return (
    <section className="w-full py-8">
      <div className="containerPadding">
        <div className="pt-16 pb-12 flex flex-wrap gap-x-20 gap-y-10 items-center w-full">
          {/* Search */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={() => setDebouncedSearch(searchTerm)}
            placeholder="Search"
          />

          {/* Filter */}
          {/* <div className="flex items-center gap-4">
            <span className="text-[#929292] textBody16">Filter by:</span>
            <DropdownSelect
              filters={["All", "Conference", "Workshop"]}
              onChange={(val) => console.log(val)}
            />
          </div> */}

          {/* Sort */}
          <div className="flex items-center gap-4">
            <span className="text-[#929292] textBody16">Sort by:</span>
            <DropdownSelect
              filters={[
                { key: "createdAt", label: "Created at" },
              ]}
              onChange={(val) => setSortBy(val)}
            />
          </div>

          {/* Order */}
          <div className="flex items-center gap-4">
            <span className="text-[#929292] textBody16">Order by:</span>
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
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />

        <Loader isLoading={isLoading}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 ">My Courses</h2>
            {/* Grid */}
            <div
              className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5 
            gap-6
          "
            >
              {enrolledCourses?.courses?.map((course) => (
                <div
                  key={course.id}
                  className="
                bg-white/10 
                backdrop-blur 
                p-4 rounded-xl 
                border border-white/20 
                shadow-md hover:shadow-lg 
                transition-all duration-300
              "
                >
                  <Image
                    src={courseImage}
                    alt={course.title}
                    className="w-full h-36 object-cover rounded-lg mb-3"
                  />

                  <h3 className="text-lg font-semibold  mb-1">
                    {course.title}
                  </h3>

                  {/* <p className="text-sm ">{course.price}</p> */}

                  <Link
                    href={`/courses/${course._id}`}
                    className="
                bg-blue-500 hover:bg-blue-600 
                text-white font-medium 
                py-2 rounded-lg 
                transition-all duration-300
                mt-3 w-full inline-block text-center"
                  >
                    View Course
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Loader>
      </div>
    </section>
  );
}