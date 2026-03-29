"use client";

import CourseOverview from "@components/Common/CourseOverview/CourseOverview";
import { useSearchParams } from "next/navigation";

export default function AddEditCourse() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <section className="py-6 px-10">
      <CourseOverview />
    </section>
  );
}
