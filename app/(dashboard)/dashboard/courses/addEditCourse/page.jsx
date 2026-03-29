"use client";

import Loader from "@common/Loader";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import StepWrapper from "@common/StepComponent/StepWrapper/StepWrapper";
import CourseForm from "@components/Dashboard/Courses/CourseForm/CourseForm";
import Sections from "@components/Dashboard/Courses/Sections/Sections";
import Lectures from "@components/Dashboard/Courses/Lectures/Lectures";
import { createCourse, getCourseById, updateCourse } from "@api/ApiCourse";
import { createSection, deleteSection, updateSection } from "@api/ApiSection";
import { createLecture, deleteLecture, updateLecture } from "@api/ApiLecture";
import { createFormData } from "@utils/createFormData";
import CourseOverview from "@components/Dashboard/Courses/CourseOverview/CourseOverview";
import Curriculum from "@components/Dashboard/Courses/Curriculum/Curriculum";

export default function AddEditCourse() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const queryClient = useQueryClient();

  // .......................Load initial course data .....................
  // Fetch course by ID
  const derivedId = id || courseData?.course?._id;

  const {
    data: courseDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["courses", { id: derivedId }],
    queryFn: getCourseById,
    enabled: !!derivedId,         // run only if derivedId exists
    select: (res) => res.data.data, // adjust if API shape differs
  });

  useEffect(() => {
    if (courseDetails) {
      setLoading(true);
      setCourseData(prev => ({
        ...prev,
        course: {
          _id: courseDetails._id,
          title: courseDetails?.title,
          instructorId: courseDetails?.instructorId,
          createdAt: courseDetails?.createdAt,
          updatedAt: courseDetails?.updatedAt
        },
        sections: courseDetails?.sections,
        lectures: prev.lectures
      }));
      setLoading(false);
    }
  }, [courseDetails])

  const refreshCourseData = () => {
    const id = courseData.course._id;
    console.log("Refreshing course data for id:", id);
    queryClient.invalidateQueries({ queryKey: ["courses", { id }] });
  }

  // ................................Course ..............................
  const { mutateAsync: addCourseMutation } = useMutation({
    mutationFn: createCourse,
    onError: (error) => {
      console.error("Course creation failed:", error);
    },
    onSuccess: () => {
      console.log("Course created successfully");
    },
  });

  const { mutateAsync: updateCourseMutation } = useMutation({
    mutationFn: updateCourse,
    onError: (error) => {
      console.error("Course update failed:", error);
    },
    onSuccess: () => {
      console.log("Course updated successfully");
    },
  });

  const handleCourse = async ({ data, reset }) => {
    try {
      setLoading(true);

      if (courseData.course) {
        // Edit course
        const response = await updateCourseMutation({ id, payload: data });
        Swal.fire({
          title: "Success",
          text: "Course updated successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refreshCourseData();
        return response;
      } else {
        // Add course
        const response = await addCourseMutation(data);
        setCourseData({ ...courseData, course: response.data.data.course });
        Swal.fire({
          title: "Success",
          text: "Course added successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        return response;
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error adding event:", error);
    } finally {
      setLoading(false);
    }
  };
  // ..............................Section .................................
  const { mutateAsync: addSectionMutation } = useMutation({
    mutationFn: createSection,
    onError: (error) => {
      console.error("Section creation failed:", error);
    },
    onSuccess: () => {
      console.log("Section created successfully");
    },
  });

  const { mutateAsync: updateSectionMutation } = useMutation({
    mutationFn: updateSection,
    onError: (error) => {
      console.error("Section update failed:", error);
    },
    onSuccess: () => {
      console.log("Section updated successfully");
    },
  });

  const { mutateAsync: deleteSectionMutation } = useMutation({
    mutationFn: (id) => deleteSection(id),
    onError: (error) => { },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });

  const handleSection = async ({ sectionId, data, isEdit, reset }) => {
    try {
      setLoading(true);
      const payload = { ...data, courseId: courseData.course._id };
      if (isEdit) {
        // Edit section
        console.log("Edit Section")
        const response = await updateSectionMutation({ id: sectionId, payload });
        Swal.fire({
          title: "Success",
          text: "Section updated successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

      } else {
        // Add section
        console.log("Add Section")
        const response = await addSectionMutation(payload);
        Swal.fire({
          title: "Success",
          text: "Section added successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      refreshCourseData();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error adding section:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLectures = async ({ sectionId, lectures }) => {
    const updatedCourseData = { ...courseData, lectures };
    setCurrentSectionId(sectionId);
    setCourseData(updatedCourseData);
    setCurrentStep(currentStep + 1);
  };

  const handleDeleteSection = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;
    try {
      await deleteSectionMutation(id);
      refreshCourseData();
      Swal.fire({
        title: "Success",
        text: "Section deleted successfully!",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error deleted section:", error);
    }
  };

  // ...............................Lecture .................................
  const { mutateAsync: addLectureMutation } = useMutation({
    mutationFn: createLecture,
    onError: (error) => {
      console.error("Section creation failed:", error);
    },
    onSuccess: () => {
      console.log("Section created successfully");
    },
  });

  const { mutateAsync: updateLectureMutation } = useMutation({
    mutationFn: updateLecture,
    onError: (error) => {
      console.error("Section update failed:", error);
    },
    onSuccess: () => {
      console.log("Section updated successfully");
    },
  });

  const { mutateAsync: deleteLectureMutation } = useMutation({
    mutationFn: (id) => deleteLecture(id),
    onError: (error) => { },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });

  const handleLecture = async ({ lectureId, data, isEdit, reset }) => {
    console.log("Add")
    try {
      const payload = { ...data, sectionId: currentSectionId };
      const payloadFormData = createFormData(payload, ["video"]);
      const previousAllLecture = courseData.lectures;
      console.log(payload);
      setLoading(true);
      if (isEdit) {
        // Edit section
        console.log("Edit Section")
        const response = await updateLectureMutation({ id: lectureId, payload: data });
        const updatedLectures = previousAllLecture.map((lecture) =>
          lecture._id === lectureId ? { ...response.data.data } : lecture
        );
        console.log("Updated Sections:", updatedLectures);
        setCourseData({ ...courseData, lectures: updatedLectures });
        Swal.fire({
          title: "Success",
          text: "Section updated successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Add section
        console.log("Add Lecture")
        const response = await addLectureMutation(payloadFormData);
        refreshCourseData();
        const updatedLecture = [...previousAllLecture, response.data.data];
        setCourseData({ ...courseData, lectures: updatedLecture });
        Swal.fire({
          title: "Success",
          text: "Lecture added successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      refreshCourseData();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error adding lecture:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;
    try {
      await deleteLectureMutation(id);
      refreshCourseData();
      setCurrentStep(1);
      Swal.fire({
        title: "Success",
        text: "Lecture deleted successfully!",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error deleted lecture:", error);
    }
  };

  // ................................Others .................................
  if (id && !courseData.course) {
    return <h1 className="text-2xl m-6 font-semibold">No course found</h1>
  }
  console.log(courseData);

  return (
    // <section className="py-6 px-10">
    //   <h6 className="textHeading28 text-[#1E453C] mb-[56px]">Add Course</h6>
    //   {/* <button className="text-green-800 hover:text-white border-2 border-green-800 px-3 py-2 rounded-2xl hover:bg-green-800/50 transition duration-200">Course overview</button> */}

    //   <Loader isLoading={loading || isLoading}>
    //     {/* <StepWrapper
    //       currentStep={currentStep}
    //       setCurrentStep={setCurrentStep}
    //       steps={[
    //         {
    //           title: "Course",
    //           content:
    //             <CourseForm
    //               data={courseData?.course}
    //               onSubmit={handleCourse}
    //               isEdit={!!courseData?.course}
    //             />
    //         },
    //         {
    //           title: "Sections",
    //           content:
    //             <Sections
    //               data={courseData?.sections}
    //               onSubmit={handleSection}
    //               handleViewLectures={handleViewLectures}
    //               handleDeleteSection={handleDeleteSection}
    //             />
    //         },
    //         {
    //           title: "Lectures",
    //           content:
    //             <Lectures
    //               data={courseData?.lectures}
    //               onSubmit={handleLecture}
    //               handleDeleteLecture={handleDeleteLecture}
    //             />
    //         },
    //       ]}
    //     /> */}

    //     <StepWrapper
    //       currentStep={currentStep}
    //       setCurrentStep={setCurrentStep}
    //       steps={[
    //         {
    //           title: "Course Overview",
    //           content:
    //             <CourseOverview />
    //         },
    //         {
    //           title: "Curriculum",
    //           content:
    //             <CourseOverview />
    //         },
    //         {
    //           title: "Pricing",
    //           content:
    //             <CourseOverview />
    //         },
    //         {
    //           title: "Preview",
    //           content:
    //             <CourseOverview />
    //         },
    //       ]}
    //     />
    //   </Loader>
    // </section>
    <section className="p-4">
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
          <p className="text-[#B683D5] textBody16 ">Course</p>
          <span className="">
            <svg width="5" height="17" viewBox="0 0 5 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.59082 15.5913L3.70813 0.591278" stroke="#C4C4C4" stroke-linecap="square" />
            </svg>
          </span>
          <p className="text-[#663F7E] textLabel16">Add Course</p>
        </div>
      </div>

      <div className="w-full bg-[#FFFAFA] rounded-[4px] p-4 ">
        <Loader isLoading={loading || isLoading}>
          <StepWrapper
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={[
              {
                title: "Course Overview",
                content:
                  <CourseOverview />
              },
              {
                title: "Curriculum",
                content:
                  <Curriculum/>
              },
              {
                title: "Pricing",
                content:
                  <div>
                    Pricing
                  </div>
              },
              {
                title: "Preview",
                content:
                  <div>
                    Preview
                  </div>
              },
            ]}
          />
        </Loader>
      </div>
    </section>
  );
}
