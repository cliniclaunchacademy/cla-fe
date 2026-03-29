import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getCourseById } from '@api/ApiCourse';
import Loader from '@common/Loader';
import WatchLecture from '@components/Dashboard/Courses/WatchLecture/WatchLecture';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

export default function CourseOverview({ id }) {
  const [watchLectureId, setWatchLectureId] = useState(null);

  const {
    data: courseDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["courses", { id: id }],
    queryFn: getCourseById,
    enabled: !!id,         // run only if id exists
    select: (res) => res.data.data, // adjust if API shape differs
  });

  useEffect(()=>{
    if(watchLectureId) return;
    setWatchLectureId(courseDetails?.sections?.[0]?.lectures?.[0]?._id || null);
  },[courseDetails])

  console.log("courseDetails", courseDetails);
  console.log(watchLectureId);

  if (!courseDetails){
    return <p>No course details available.</p>;
  }

  return (
    <div>
      <Loader isLoading={isLoading}>
        <div className='flex gap-7'>
          <div className='w-7/12'>
            {/* <div className='w-full h-60 border rounded-xl flex items-center justify-center'>
              <p>Video play</p>
            </div> */}
            <WatchLecture
              lectureId={watchLectureId}
            />
          </div>
          <div className='flex-1'>
            <p className='font-semibold mb-2'>Section & Lecture</p>

            {courseDetails?.sections?.length > 0 && <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={`section-0`}
            >
              {courseDetails.sections.map((section, sectionIndex) => (
                <AccordionItem key={section._id} value={`section-${sectionIndex}`}>
                  <AccordionTrigger>
                    {section.title || `Section ${sectionIndex + 1}`}
                  </AccordionTrigger>

                  <AccordionContent className="ps-4 flex flex-col gap-2">
                    {section.lectures?.length > 0 ? (
                      section.lectures.map((lecture, lectureIndex) => (
                        <button
                          key={lecture._id}
                          onClick={() => {
                            setWatchLectureId(lecture._id);
                          }}
                          className="py-3 w-full text-start border-b"
                        >
                          {lecture.title || `Lecture ${lectureIndex + 1}`}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 py-2">
                        No lectures available
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>}
          </div>
        </div>
      </Loader>
    </div>
  )
}
