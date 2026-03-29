"use client";
import Modal from '@common/Modal';
import React, { useState } from 'react'
import SectionForm from '../SectionForm/SectionForm';

export default function Sections({ data, onSubmit, handleViewLectures, handleDeleteSection }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sectionData, setSectionData] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    const toggleModalSectionData = (data = {}, isEdit) => {
        setIsModalOpen(!isModalOpen);
        setIsEdit(isEdit);
        setSectionData(data)
    };

    return (
        <div className='w-full flex flex-col items-start'>
            <button
                onClick={() => toggleModalSectionData()}
                className="inline-block px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                Add Section
            </button>
            <div className="w-full space-y-4">
                {data?.map((section) => (
                    <div
                        key={section._id}
                        className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
                    >
                        {/* Section Title */}
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-lg">{section.title}</h2>

                            <span className="text-sm text-gray-500">
                                {section.lectures.length} Lecture
                                {section.lectures.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => handleViewLectures({ sectionId: section._id, lectures: section.lectures })} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                                View All Lectures
                            </button>
                            <button
                                onClick={() => toggleModalSectionData(section, true)}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition">
                                Edit Section
                            </button>
                             <button
                                onClick={() => handleDeleteSection(section._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-700 transition">
                                Delete Section
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => toggleModalSectionData()}
            >
                <div>
                    <h1 className='text-xl text-semibold mb-4'>{isEdit ? "Update" : "Create"} Section</h1>
                    <SectionForm
                        data={sectionData}
                        onSubmit={onSubmit}
                        isEdit={isEdit}
                    />
                </div>
            </Modal>
        </div>
    )
}