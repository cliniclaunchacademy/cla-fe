"use client";
import Modal from '@common/Modal';
import React, { useEffect, useRef, useState } from 'react'
import LectureForm from '../LectureForm/LectureForm';
import WatchLecture from '../WatchLecture/WatchLecture';
import { useQuery } from '@tanstack/react-query';
import { getLectureStatus } from '@api/ApiLecture';

/* ===========================
    Lecture Item Component
=========================== */
function LectureItem({
    lecture,
    toggleModalWatchLecture,
    toggleModalLectureData,
    handleDeleteLecture,
}) {
    const [status, setStatus] = useState(lecture.isPublished || "pending");

    const POLL_INTERVAL_MS = 5 * 1000;        // 5 seconds
    const MAX_POLL_DURATION_MS = 15 * 60 * 1000; // 15 minutes

    const startTimeRef = useRef(Date.now());

    const { data } = useQuery({
        queryKey: ["lecture-status", lecture._id],

        // API call
        queryFn: () => getLectureStatus(lecture._id),

        // Start polling only if:
        // 1. lecture id exists
        // 2. lecture is still processing
        enabled: Boolean(lecture._id) && status === "pending",

        // React Query will call this before every refetch
        // Return:
        // - number → keep polling after that delay
        // - false → stop polling
        refetchInterval: () => {
            const elapsedTime = Date.now() - startTimeRef.current;

            //  Stop polling after 15 minutes
            if (elapsedTime >= MAX_POLL_DURATION_MS) {
                return false;
            }

            //  Poll every 5 seconds
            return POLL_INTERVAL_MS;
        },
    });

    // Sync query result → local state
    useEffect(() => {
        if (data?.data?.status && data.data.status !== status) {
            setStatus(data.data.status);
        }
    }, [data, status]);

    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-base">{lecture.title}</h3>
                    <p className="text-xs text-gray-500">
                        Video Key: {lecture.videoKey}
                    </p>
                </div>

                <div className="flex gap-2 items-center">
                    <span className="px-3 py-1 text-sm font-semibold border border-slate-400 rounded-lg">
                        Published: {status}
                    </span>

                    {status === "success" && (
                        <>
                            <button
                                onClick={() => toggleModalWatchLecture(lecture._id)}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Watch
                            </button>

                            <button
                                onClick={() => toggleModalLectureData(lecture, true)}
                                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDeleteLecture(lecture._id)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </>
                    )}

                    {status === "failed" && (
                        <span className="text-xs text-red-500">
                            Processing failed
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ===========================
    Main Lectures Component
=========================== */
export default function Lectures({ data, onSubmit, handleDeleteLecture }) {
    const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
    const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
    const [lectureData, setLectureData] = useState({});
    const [watchLectureId, setWatchLectureId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const toggleModalLectureData = (data = {}, isEdit = false) => {
        setIsLectureModalOpen(!isLectureModalOpen);
        setIsEdit(isEdit)
        setLectureData(data);
    };

    const toggleModalWatchLecture = (lectureId = "") => {
        setWatchLectureId(lectureId);
        setIsWatchModalOpen(!isWatchModalOpen);
    };

    return (
        <div>
            <button
                onClick={() => toggleModalLectureData()}
                className="inline-block px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                Add Lecture
            </button>

            <div className="space-y-4 mt-6">
                {data?.length > 0 ? (
                    data.map((lecture) => (
                        <LectureItem
                            key={lecture._id}
                            lecture={lecture}
                            toggleModalWatchLecture={toggleModalWatchLecture}
                            toggleModalLectureData={toggleModalLectureData}
                            handleDeleteLecture={handleDeleteLecture}
                        />
                    ))
                ) : (
                    <p className="italic text-gray-400 text-sm">
                        No lectures added yet.
                    </p>
                )}
            </div>

            {/* Create / Edit Modal */}
            <Modal
                isOpen={isLectureModalOpen}
                onClose={() => toggleModalLectureData()}
            >
                <div>
                    <h1 className='text-xl text-semibold mb-4'>{isEdit ? "Update" : "Create"} Lecture</h1>
                    <LectureForm
                        data={lectureData}
                        onSubmit={onSubmit}
                        isEdit={isEdit}
                    />
                </div>
            </Modal>

            {/* Watch Modal */}
            <Modal
                isOpen={isWatchModalOpen}
                onClose={() => toggleModalWatchLecture()}
            >
                <WatchLecture
                    lectureId={watchLectureId}
                />
            </Modal>
        </div>
    )
}
