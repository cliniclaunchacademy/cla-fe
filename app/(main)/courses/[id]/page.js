"use client";
import CourseOverview from "@components/Common/CourseOverview/CourseOverview";
import { use } from "react";

export default function Course({ params }) {
  const { id } = use(params);

  return (
    <div>
      <h1 className="text-xl mt-5 mb-10 font-semibold">Course {id}</h1>
      <CourseOverview id={id} />
    </div>
  );
}
