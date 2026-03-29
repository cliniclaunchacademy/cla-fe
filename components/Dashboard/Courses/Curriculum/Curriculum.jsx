import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import RichTextEditor from '@common/RichTextEditor';
import FormFieldTextarea from '@common/FormFieldComponent/FormFieldTextarea/FormFieldTextarea';
import Modal from '@common/Modal';
import FormButton from '@common/FormFieldComponent/FormButton/FormButton';
import FormFieldInput from '@common/FormFieldComponent/FormFieldInput/FormFieldInput';
import { useForm } from 'react-hook-form';
import FormFieldPdfUpload from '@common/FormFieldComponent/FormFieldFileUpload/FormFieldPdfUpload';
import FormFieldVideoUpload from '@common/FormFieldComponent/FormFieldVideoUpload/FormFieldVideoUpload';

function VideoResourcesLinkForm({
    data = null,
    onSubmit,
    isEdit = false,
    register,
    errors,
    toggleLinkModal
}) {
    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     control,
    //     reset,
    //     formState: { errors },
    // } = useForm({
    //     defaultValues: {
    //         linkTitle: "",
    //         resourceLink: "",
    //     },
    // });

    // // Populate values when editing
    // useEffect(() => {
    //     if (isEdit && data) {
    //         setValue("linkTitle", data.linkTitle || "");
    //         setValue("resourceLink", data.resourceLink || "");
    //     }
    // }, [isEdit, data, setValue]);

    // const submitHandler = (data) => {
    //     console.log(data);
    //     if (onSubmit) onSubmit({ data, reset });
    // };

    return (
        <section>
            <h3 className="text-center text-[#484848] textHeading20 merriweather mb-[27px] ">Add Link</h3>

            {/* <form
                onSubmit={handleSubmit(submitHandler)}
                className="flex flex-col gap-y-3 "> */}
            <FormFieldInput
                id="videoLinkTitle"
                label="Enter Link title"
                placeholder="enter link title"
                vertical={true}
                registration={register("videoLinkTitle", {
                    required: "Link title is required",
                })}
                error={errors.videoLinkTitle}
                width={448}
            // disabled={isEdit}
            />

            <FormFieldInput
                type="url"
                id="videoResourceLink"
                label="Enter resource link"
                placeholder="paste URL"
                registration={register("videoResourceLink", {
                    required: "Resource link is required",
                })}
                error={errors.videoResourceLink}
                width={448}
                vertical={true}
                prefix={true}
                prefixIcon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.95 21C6.58333 21 5.41667 20.5167 4.45 19.55C3.48333 18.5833 3 17.4167 3 16.05C3 15.3833 3.125 14.75 3.375 14.15C3.625 13.55 3.98333 13.0167 4.45 12.55L7.8 9.225L9.2 10.625L5.85 13.975C5.56667 14.2583 5.35417 14.5792 5.2125 14.9375C5.07083 15.2958 5 15.6667 5 16.05C5 16.8667 5.2875 17.5625 5.8625 18.1375C6.4375 18.7125 7.13333 19 7.95 19C8.33333 19 8.70833 18.9292 9.075 18.7875C9.44167 18.6458 9.76667 18.4333 10.05 18.15L13.375 14.8L14.8 16.225L11.45 19.55C10.9833 20.0167 10.45 20.375 9.85 20.625C9.25 20.875 8.61667 21 7.95 21ZM9.925 15.5L8.5 14.075L14.075 8.5L15.5 9.925L9.925 15.5ZM16.2 14.8L14.8 13.375L18.15 10.05C18.4333 9.76667 18.6417 9.45 18.775 9.1C18.9083 8.75 18.975 8.38333 18.975 8C18.975 7.16667 18.6917 6.45833 18.125 5.875C17.5583 5.29167 16.8583 5 16.025 5C15.6417 5 15.2708 5.07083 14.9125 5.2125C14.5542 5.35417 14.2333 5.56667 13.95 5.85L10.625 9.2L9.2 7.8L12.55 4.45C13.0167 3.98333 13.55 3.625 14.15 3.375C14.75 3.125 15.3833 3 16.05 3C17.4167 3 18.5792 3.48333 19.5375 4.45C20.4958 5.41667 20.975 6.59167 20.975 7.975C20.975 8.625 20.8542 9.25 20.6125 9.85C20.3708 10.45 20.0167 10.9833 19.55 11.45L16.2 14.8Z" fill="#C4C4C4" />
                    </svg>
                }
            // disabled={isEdit}
            />

            <FormButton type="button" className={"!mt-[32px] "} label="Resource" onClick={() => toggleLinkModal()} />
            {/* </form> */}
        </section>
    )
}
function ArticleResourcesLinkForm({
    data = null,
    onSubmit,
    isEdit = false,
    register,
    errors,
    toggleLinkModal
}) {
    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     control,
    //     reset,
    //     formState: { errors },
    // } = useForm({
    //     defaultValues: {
    //         linkTitle: "",
    //         resourceLink: "",
    //     },
    // });

    // // Populate values when editing
    // useEffect(() => {
    //     if (isEdit && data) {
    //         setValue("linkTitle", data.linkTitle || "");
    //         setValue("resourceLink", data.resourceLink || "");
    //     }
    // }, [isEdit, data, setValue]);

    // const submitHandler = (data) => {
    //     console.log(data);
    //     if (onSubmit) onSubmit({ data, reset });
    // };

    return (
        <section>
            <h3 className="text-center text-[#484848] textHeading20 merriweather mb-[27px] ">Add Link</h3>

            {/* <form
                onSubmit={handleSubmit(submitHandler)}
                className="flex flex-col gap-y-3 "> */}
            <FormFieldInput
                id="articleLinkTitle"
                label="Enter Link title"
                placeholder="enter link title"
                vertical={true}
                registration={register("articleLinkTitle", {
                    required: "Link title is required",
                })}
                error={errors.articleLinkTitle}
                width={448}
            // disabled={isEdit}
            />

            <FormFieldInput
                type="url"
                id="articleResourceLink"
                label="Enter resource link"
                placeholder="paste URL"
                registration={register("articleResourceLink", {
                    required: "Resource link is required",
                })}
                error={errors.articleResourceLink}
                width={448}
                vertical={true}
                prefix={true}
                prefixIcon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.95 21C6.58333 21 5.41667 20.5167 4.45 19.55C3.48333 18.5833 3 17.4167 3 16.05C3 15.3833 3.125 14.75 3.375 14.15C3.625 13.55 3.98333 13.0167 4.45 12.55L7.8 9.225L9.2 10.625L5.85 13.975C5.56667 14.2583 5.35417 14.5792 5.2125 14.9375C5.07083 15.2958 5 15.6667 5 16.05C5 16.8667 5.2875 17.5625 5.8625 18.1375C6.4375 18.7125 7.13333 19 7.95 19C8.33333 19 8.70833 18.9292 9.075 18.7875C9.44167 18.6458 9.76667 18.4333 10.05 18.15L13.375 14.8L14.8 16.225L11.45 19.55C10.9833 20.0167 10.45 20.375 9.85 20.625C9.25 20.875 8.61667 21 7.95 21ZM9.925 15.5L8.5 14.075L14.075 8.5L15.5 9.925L9.925 15.5ZM16.2 14.8L14.8 13.375L18.15 10.05C18.4333 9.76667 18.6417 9.45 18.775 9.1C18.9083 8.75 18.975 8.38333 18.975 8C18.975 7.16667 18.6917 6.45833 18.125 5.875C17.5583 5.29167 16.8583 5 16.025 5C15.6417 5 15.2708 5.07083 14.9125 5.2125C14.5542 5.35417 14.2333 5.56667 13.95 5.85L10.625 9.2L9.2 7.8L12.55 4.45C13.0167 3.98333 13.55 3.625 14.15 3.375C14.75 3.125 15.3833 3 16.05 3C17.4167 3 18.5792 3.48333 19.5375 4.45C20.4958 5.41667 20.975 6.59167 20.975 7.975C20.975 8.625 20.8542 9.25 20.6125 9.85C20.3708 10.45 20.0167 10.9833 19.55 11.45L16.2 14.8Z" fill="#C4C4C4" />
                    </svg>
                }
            // disabled={isEdit}
            />

            <FormButton
                type="button"
                className={"!mt-[32px] "}
                label="Resource"
                onClick={toggleLinkModal}
            />
            {/* </form> */}
        </section>
    )
}

function VideoResourcesPdfForm({ control, togglePdfModal }) {
    return (
        <section>
            <h3 className="text-center text-[#484848] textHeading20 merriweather mb-[27px] ">Add Pdf</h3>

            <div
                className="flex flex-col gap-y-3 ">
                <FormFieldPdfUpload
                    name="videoResourcePdf"
                    control={control}
                // label="Brochure link (optional)"
                // rules={{ required: "Brochure is required" }}
                />
                <FormButton type="button" className={"!mt-[32px] "} label="Resource" onClick={togglePdfModal} />
            </div>
        </section>
    )
}
function ArticleResourcesPdfForm({ control, togglePdfModal }) {
    return (
        <section>
            <h3 className="text-center text-[#484848] textHeading20 merriweather mb-[27px] ">Add Pdf</h3>
            <div
                className="flex flex-col gap-y-3 ">
                <FormFieldPdfUpload
                    name="articleResourcePdf"
                    control={control}
                // label="Brochure link (optional)"
                // rules={{ required: "Brochure is required" }}
                />
                <FormButton type="button" className={"!mt-[32px] "} label="Resource" onClick={togglePdfModal} />
            </div>
        </section>
    )
}
// ..................................................
function VideoResourcesSection({ register, errors, control, watch, setValue }) {
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    const togglePdfModal = () => setIsPdfModalOpen(prev => !prev);
    const toggleLinkModal = () => setIsLinkModalOpen(prev => !prev);

    const videoResourcePdf = watch("videoResourcePdf");
    const videoResourcePdfName = videoResourcePdf
        ? typeof videoResourcePdf === "string"
            ? videoResourcePdf.split("/").pop()
            : videoResourcePdf.name
        : null;

    const videoLinkTitle = watch("videoLinkTitle");
    const videoResourceLink = watch("videoResourceLink");

    return (
        <div className='flex flex-col gap-4'>
            {/* PDF and Link buttons */}
            <div className='flex gap-2 justify-center'>
                {!videoResourcePdfName &&
                    <button
                        type='button'
                        onClick={togglePdfModal}
                        className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848]'>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.8316 13.9358C21.9138 13.8205 21.9458 13.7466 21.9585 13.7068C21.8906 13.671 21.8007 13.5981 21.3102 13.5981C21.0316 13.5981 20.6818 13.6103 20.311 13.6577C20.7607 14.0037 20.8705 14.1786 21.1646 14.1786C21.2931 14.1791 21.6617 14.1736 21.8316 13.9358Z" fill="#663F7E" />
                            <path d="M11.3301 18.0051C11.4123 17.9792 11.8923 17.7601 12.7866 16.1094C11.607 16.772 11.127 17.3165 11.0928 17.6233C11.0868 17.6741 11.0719 17.8076 11.3301 18.0051Z" fill="#FFFAFA" />
                            <path d="M28.4138 21.5172V7.712C28.4138 7.28938 28.363 6.97655 28.1103 6.72331L21.6899 0.303448C21.4974 0.110897 21.2303 0 20.9572 0H4.94508C4.29073 0 3.58618 0.505379 3.58618 1.61434V21.5172H28.4138ZM20.6896 1.8709C20.6896 1.61821 20.9947 1.49186 21.1735 1.67062L26.7431 7.24028C26.9219 7.41903 26.7956 7.72414 26.5429 7.72414H20.6896V1.8709ZM10.1694 17.52C10.2698 16.6218 11.3804 15.6817 13.4714 14.7239C14.3012 12.9054 15.0907 10.6648 15.5614 8.79283C15.0107 7.59448 14.4756 6.03972 14.8656 5.12772C15.0025 4.80828 15.1729 4.56331 15.4913 4.45738C15.6171 4.41545 15.9349 4.36248 16.0518 4.36248C16.3299 4.36248 16.5743 4.72055 16.7476 4.94124C16.9103 5.14869 17.2794 5.58841 16.5418 8.69407C17.2855 10.2301 18.3393 11.7948 19.3489 12.8662C20.0723 12.7354 20.6946 12.6687 21.2016 12.6687C22.0656 12.6687 22.5892 12.8701 22.8027 13.285C22.9793 13.6281 22.907 14.0292 22.5876 14.4767C22.2803 14.9065 21.8565 15.1338 21.3627 15.1338C20.6918 15.1338 19.9106 14.7101 19.0394 13.8731C17.4742 14.2003 15.6458 14.784 14.1688 15.4301C13.7076 16.4088 13.2656 17.1972 12.854 17.7754C12.2896 18.5688 11.8019 18.9379 11.3191 18.9379C11.1271 18.9379 10.9429 18.8756 10.7856 18.7581C10.2102 18.3261 10.1329 17.8466 10.1694 17.52Z" fill="#FFFAFA" />
                            <path d="M11.7086 25.3011C11.6302 25.193 11.521 25.1025 11.3803 25.0297C11.2396 24.9568 11.0531 24.9204 10.8219 24.9204H10.1433V27.1229H10.9731C11.0834 27.1229 11.1927 27.1041 11.3014 27.0661C11.4095 27.0285 11.5088 26.9668 11.5993 26.8812C11.6898 26.7957 11.7626 26.6765 11.8178 26.5232C11.873 26.3698 11.9006 26.18 11.9006 25.9538C11.9006 25.8633 11.8879 25.7585 11.863 25.641C11.8377 25.5229 11.7863 25.4098 11.7086 25.3011Z" fill="#FFFAFA" />
                            <path d="M16.1892 10.0269C15.7941 11.3918 15.2739 12.8655 14.7139 14.2001C15.867 13.7526 17.1205 13.362 18.2979 13.0856C17.553 12.2205 16.8088 11.1402 16.1892 10.0269Z" fill="#FFFAFA" />
                            <path d="M3.58618 22.6206V30.8965C3.58618 31.4532 4.25929 31.9999 4.94508 31.9999H27.0549C27.7407 31.9999 28.4138 31.4532 28.4138 30.8965V22.6206H3.58618ZM12.6323 26.7194C12.5368 26.9483 12.4033 27.1409 12.2323 27.2965C12.0612 27.4521 11.8549 27.5729 11.6138 27.6584C11.3727 27.7439 11.1056 27.7864 10.8143 27.7864H10.1429V29.793H9.23749V24.2338H10.8364C11.0725 24.2338 11.3065 24.2714 11.5376 24.347C11.7688 24.4225 11.9763 24.5356 12.16 24.6863C12.3437 24.8369 12.4921 25.0195 12.6052 25.233C12.7183 25.4465 12.7751 25.6865 12.7751 25.9536C12.7757 26.2355 12.7277 26.4904 12.6323 26.7194ZM18.1804 28.0319C18.0822 28.3563 17.958 28.6278 17.8069 28.8468C17.6557 29.0658 17.4863 29.238 17.2976 29.3638C17.1089 29.4896 16.9269 29.5834 16.7509 29.6468C16.5749 29.7097 16.4138 29.75 16.2681 29.7676C16.1225 29.7842 16.0143 29.793 15.9437 29.793H13.8394V24.2338H15.5139C15.9818 24.2338 16.3928 24.3083 16.747 24.4562C17.1012 24.6041 17.3958 24.8021 17.6298 25.0482C17.8637 25.2943 18.038 25.5751 18.1539 25.889C18.2692 26.203 18.3271 26.5263 18.3271 26.8584C18.3277 27.3163 18.2786 27.7075 18.1804 28.0319ZM23.1172 24.9202H20.56V26.6703H22.8833V27.2887H20.56V29.793H19.6397V24.2338H23.1172V24.9202Z" fill="#FFFAFA" />
                            <path d="M16.9738 25.5351C16.8155 25.3514 16.6003 25.203 16.3289 25.0899C16.0574 24.9767 15.7054 24.9199 15.2729 24.9199H14.7449V29.129H15.6425C16.256 29.129 16.6985 28.9332 16.97 28.5409C17.2414 28.1486 17.3771 27.5803 17.3771 26.8361C17.3771 26.6049 17.3496 26.3759 17.2944 26.1497C17.2387 25.9235 17.1322 25.7188 16.9738 25.5351Z" fill="#FFFAFA" />
                            <path d="M15.8542 5.35847C15.8001 5.37668 15.1204 6.32785 15.9072 7.13282C16.4308 5.96592 15.8779 5.35075 15.8542 5.35847Z" fill="#FFFAFA" />
                        </svg>
                        <span>PDF</span>
                    </button>
                }

                {!(videoLinkTitle && videoResourceLink) &&
                    <button
                        type='button'
                        onClick={toggleLinkModal}
                        className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848]'>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.6 28C8.77778 28 7.22222 27.3556 5.93333 26.0667C4.64444 24.7778 4 23.2222 4 21.4C4 20.5111 4.16667 19.6667 4.5 18.8667C4.83333 18.0667 5.31111 17.3556 5.93333 16.7333L10.4 12.3L12.2667 14.1667L7.8 18.6333C7.42222 19.0111 7.13889 19.4389 6.95 19.9167C6.76111 20.3944 6.66667 20.8889 6.66667 21.4C6.66667 22.4889 7.05 23.4167 7.81667 24.1833C8.58333 24.95 9.51111 25.3333 10.6 25.3333C11.1111 25.3333 11.6111 25.2389 12.1 25.05C12.5889 24.8611 13.0222 24.5778 13.4 24.2L17.8333 19.7333L19.7333 21.6333L15.2667 26.0667C14.6444 26.6889 13.9333 27.1667 13.1333 27.5C12.3333 27.8333 11.4889 28 10.6 28ZM13.2333 20.6667L11.3333 18.7667L18.7667 11.3333L20.6667 13.2333L13.2333 20.6667ZM21.6 19.7333L19.7333 17.8333L24.2 13.4C24.5778 13.0222 24.8556 12.6 25.0333 12.1333C25.2111 11.6667 25.3 11.1778 25.3 10.6667C25.3 9.55556 24.9222 8.61111 24.1667 7.83333C23.4111 7.05556 22.4778 6.66667 21.3667 6.66667C20.8556 6.66667 20.3611 6.76111 19.8833 6.95C19.4056 7.13889 18.9778 7.42222 18.6 7.8L14.1667 12.2667L12.2667 10.4L16.7333 5.93333C17.3556 5.31111 18.0667 4.83333 18.8667 4.5C19.6667 4.16667 20.5111 4 21.4 4C23.2222 4 24.7722 4.64444 26.05 5.93333C27.3278 7.22222 27.9667 8.78889 27.9667 10.6333C27.9667 11.5 27.8056 12.3333 27.4833 13.1333C27.1611 13.9333 26.6889 14.6444 26.0667 15.2667L21.6 19.7333Z" fill="#FFFAFA" />
                        </svg>
                        <span>Link</span>
                    </button>
                }
            </div>

            {/* PDF row */}
            {videoResourcePdfName &&
                <div className='flex justify-between items-center'>
                    <div className='flex gap-1 items-center text-[#737272] textLabel16'>
                        <span>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.33317 16.5002H14.6665V14.6668H7.33317V16.5002ZM7.33317 12.8335H14.6665V11.0002H7.33317V12.8335ZM5.49984 20.1668C4.99567 20.1668 4.56407 19.9873 4.20505 19.6283C3.84602 19.2693 3.6665 18.8377 3.6665 18.3335V3.66683C3.6665 3.16266 3.84602 2.73107 4.20505 2.37204C4.56407 2.01301 4.99567 1.8335 5.49984 1.8335H12.8332L18.3332 7.3335V18.3335C18.3332 18.8377 18.1537 19.2693 17.7946 19.6283C17.4356 19.9873 17.004 20.1668 16.4998 20.1668H5.49984ZM11.9165 8.25016V3.66683H5.49984V18.3335H16.4998V8.25016H11.9165Z" fill="currentColor" />
                            </svg>
                        </span>
                        <span>{videoResourcePdfName}</span>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <button
                            type='button'
                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                            </svg>
                            <span>Open</span>
                        </button>
                        <button
                            type='button'
                            onClick={togglePdfModal}
                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200'>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                            </svg>
                            <span>Edit</span>
                        </button>
                        <button
                            type='button'
                            onClick={() => setValue("videoResourcePdf", null)}
                            className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                            </svg>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            }

            {/* Link row */}
            {videoLinkTitle && videoResourceLink &&
                <div className='flex justify-between items-center'>
                    <div className='flex gap-1 items-center textLabel16'>
                        <span className='text-[#737272]'>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.2875 19.25C6.03472 19.25 4.96528 18.8069 4.07917 17.9208C3.19306 17.0347 2.75 15.9653 2.75 14.7125C2.75 14.1014 2.86458 13.5208 3.09375 12.9708C3.32292 12.4208 3.65139 11.9319 4.07917 11.5042L7.15 8.45625L8.43333 9.73958L5.3625 12.8104C5.10278 13.0701 4.90799 13.3642 4.77813 13.6927C4.64826 14.0212 4.58333 14.3611 4.58333 14.7125C4.58333 15.4611 4.84687 16.099 5.37396 16.626C5.90104 17.1531 6.53889 17.4167 7.2875 17.4167C7.63889 17.4167 7.98264 17.3517 8.31875 17.2219C8.65486 17.092 8.95278 16.8972 9.2125 16.6375L12.2604 13.5667L13.5667 14.8729L10.4958 17.9208C10.0681 18.3486 9.57917 18.6771 9.02917 18.9062C8.47917 19.1354 7.89861 19.25 7.2875 19.25ZM9.09792 14.2083L7.79167 12.9021L12.9021 7.79167L14.2083 9.09792L9.09792 14.2083ZM14.85 13.5667L13.5667 12.2604L16.6375 9.2125C16.8972 8.95278 17.0882 8.6625 17.2104 8.34167C17.3326 8.02083 17.3938 7.68472 17.3938 7.33333C17.3938 6.56944 17.134 5.92014 16.6146 5.38542C16.0951 4.85069 15.4535 4.58333 14.6896 4.58333C14.3382 4.58333 13.9983 4.64826 13.6698 4.77813C13.3413 4.90799 13.0472 5.10278 12.7875 5.3625L9.73958 8.43333L8.43333 7.15L11.5042 4.07917C11.9319 3.65139 12.4208 3.32292 12.9708 3.09375C13.5208 2.86458 14.1014 2.75 14.7125 2.75C15.9653 2.75 17.0309 3.19306 17.9094 4.07917C18.7878 4.96528 19.2271 6.04236 19.2271 7.31042C19.2271 7.90625 19.1163 8.47917 18.8948 9.02917C18.6733 9.57917 18.3486 10.0681 17.9208 10.4958L14.85 13.5667Z" fill="#737272" />
                            </svg>
                        </span>
                        <span className='text-[#5954FF]'>{videoLinkTitle}</span>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <button
                            type='button'
                            onClick={() => window.open(videoResourceLink, '_blank')}
                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                            </svg>
                            <span>Open</span>
                        </button>
                        <button
                            type='button'
                            onClick={toggleLinkModal}
                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200'>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                            </svg>
                            <span>Edit</span>
                        </button>
                        <button
                            type='button'
                            onClick={() => {
                                setValue("videoLinkTitle", null);
                                setValue("videoResourceLink", null);
                            }}
                            className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200'>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                            </svg>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            }

            {/* Modals */}
            <Modal isOpen={isPdfModalOpen} onClose={togglePdfModal} title="Add Pdf">
                <VideoResourcesPdfForm control={control} togglePdfModal={togglePdfModal} />
            </Modal>

            <Modal isOpen={isLinkModalOpen} onClose={toggleLinkModal} title="Add Link">
                <VideoResourcesLinkForm
                    register={register}
                    errors={errors}
                    toggleLinkModal={toggleLinkModal}
                />
            </Modal>
        </div>
    );
}

function LectureVideoContent({
    data = null,
    onSubmit,
    isEdit = false,
    register,
    control,
    errors,
    watch,
    setValue = { setValue }
}) {
    const [visibleDescriptonInput, setVisibleDescriptonInput] = useState(false);
    const [visibleResourcesInput, setVisibleResourcesInput] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    const togglePdfModal = () => {
        setIsPdfModalOpen(!isPdfModalOpen);
    };
    const toggleLinkModal = () => {
        setIsLinkModalOpen(!isLinkModalOpen);
    };
    const handleResourcesLink = async ({ data, reset }) => {
        console.log("handleResourcesLink", data);
    }

    const videoResourcePdf = watch ? watch("videoResourcePdf") : null;
    const videoResourcePdfName = videoResourcePdf
        ? typeof videoResourcePdf === "string"
            ? videoResourcePdf.split("/").pop()
            : videoResourcePdf.name
        : null;

    const videoResourceLink = watch ? watch("videoResourceLink") : null;
    const videoLinkTitle = watch ? watch("videoLinkTitle") : null;
    // console.log("videoResourceLink", videoResourceLink)
    // console.log("videoLinkTitle", videoLinkTitle)

    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     control,
    //     reset,
    //     formState: { errors },
    // } = useForm({
    //     defaultValues: {
    //         videoDescription: "",
    //         videoLinkTitle: "",
    //         videoResourceLink: "",
    //     },
    // });

    // // Populate values when editing
    // useEffect(() => {
    //     if (isEdit && data) {
    //         setValue("videoDescription", data.videoDescription || "");
    //         setValue("videoLinkTitle", data.videoLinkTitle || "");
    //         setValue("videoResourceLink", data.videoResourceLink || "");
    //     }
    // }, [isEdit, data, setValue]);

    // const submitHandler = (data) => {
    //     console.log("LectureVideoContent", data);
    //     if (onSubmit) onSubmit({ data, reset });
    // };

    return (
        <section>
            {/* <form
                onSubmit={handleSubmit(submitHandler)}
                className=""> */}
            <div className='w-full border border-[#EDEDED] '></div>
            <div className='py-3 '>
                <FormFieldVideoUpload
                    name="lessonVideo"
                    control={control}
                    // label="Lesson Video"
                    rules={{ required: "Video is required" }}
                />
            </div>
            <div className='w-full border border-[#EDEDED] '></div>
            <div className='py-3 '>
                {
                    visibleDescriptonInput
                        ?
                        <FormFieldTextarea
                            id="videoDescription"
                            // label="Description"
                            placeholder="Add description"
                            registration={register("videoDescription", {
                                required: "Description is required",
                            })}
                            error={errors.videoDescription}
                            labelClassName="text-[#484848] "
                            // width={674}
                            rows={2}
                            maxLength={200}
                        />
                        :
                        <button
                            type='button' onClick={() => { setVisibleDescriptonInput(true) }} className='flex gap-2 px-2 py-1.5 border border-[#663F7E] hover:border-[#351D44] rounded-[8px] textLabel14 text-[#663F7E] hover:text-[#351D44] transition duration-200 '>
                            <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16667 17.5V10.8333H2.5V9.16667H9.16667V2.5H10.8333V9.16667H17.5V10.8333H10.8333V17.5H9.16667Z" fill="currentColor" />
                            </svg>
                            </span>
                            <span>Description</span>
                        </button>
                }
            </div>
            <div className='w-full border border-[#EDEDED] '></div>
            <div className='py-3 '>
                {
                    visibleResourcesInput
                        ?
                        <div className='flex flex-col gap-4 '>
                            {/* pdf and link button */}
                            <div className='flex gap-2 justify-center '>
                                {
                                    !videoResourcePdfName &&
                                    <button
                                        type='button'
                                        onClick={() => togglePdfModal()}
                                        className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.8316 13.9358C21.9138 13.8205 21.9458 13.7466 21.9585 13.7068C21.8906 13.671 21.8007 13.5981 21.3102 13.5981C21.0316 13.5981 20.6818 13.6103 20.311 13.6577C20.7607 14.0037 20.8705 14.1786 21.1646 14.1786C21.2931 14.1791 21.6617 14.1736 21.8316 13.9358Z" fill="#663F7E" />
                                            <path d="M11.3301 18.0051C11.4123 17.9792 11.8923 17.7601 12.7866 16.1094C11.607 16.772 11.127 17.3165 11.0928 17.6233C11.0868 17.6741 11.0719 17.8076 11.3301 18.0051Z" fill="#FFFAFA" />
                                            <path d="M28.4138 21.5172V7.712C28.4138 7.28938 28.363 6.97655 28.1103 6.72331L21.6899 0.303448C21.4974 0.110897 21.2303 0 20.9572 0H4.94508C4.29073 0 3.58618 0.505379 3.58618 1.61434V21.5172H28.4138ZM20.6896 1.8709C20.6896 1.61821 20.9947 1.49186 21.1735 1.67062L26.7431 7.24028C26.9219 7.41903 26.7956 7.72414 26.5429 7.72414H20.6896V1.8709ZM10.1694 17.52C10.2698 16.6218 11.3804 15.6817 13.4714 14.7239C14.3012 12.9054 15.0907 10.6648 15.5614 8.79283C15.0107 7.59448 14.4756 6.03972 14.8656 5.12772C15.0025 4.80828 15.1729 4.56331 15.4913 4.45738C15.6171 4.41545 15.9349 4.36248 16.0518 4.36248C16.3299 4.36248 16.5743 4.72055 16.7476 4.94124C16.9103 5.14869 17.2794 5.58841 16.5418 8.69407C17.2855 10.2301 18.3393 11.7948 19.3489 12.8662C20.0723 12.7354 20.6946 12.6687 21.2016 12.6687C22.0656 12.6687 22.5892 12.8701 22.8027 13.285C22.9793 13.6281 22.907 14.0292 22.5876 14.4767C22.2803 14.9065 21.8565 15.1338 21.3627 15.1338C20.6918 15.1338 19.9106 14.7101 19.0394 13.8731C17.4742 14.2003 15.6458 14.784 14.1688 15.4301C13.7076 16.4088 13.2656 17.1972 12.854 17.7754C12.2896 18.5688 11.8019 18.9379 11.3191 18.9379C11.1271 18.9379 10.9429 18.8756 10.7856 18.7581C10.2102 18.3261 10.1329 17.8466 10.1694 17.52Z" fill="#FFFAFA" />
                                            <path d="M11.7086 25.3011C11.6302 25.193 11.521 25.1025 11.3803 25.0297C11.2396 24.9568 11.0531 24.9204 10.8219 24.9204H10.1433V27.1229H10.9731C11.0834 27.1229 11.1927 27.1041 11.3014 27.0661C11.4095 27.0285 11.5088 26.9668 11.5993 26.8812C11.6898 26.7957 11.7626 26.6765 11.8178 26.5232C11.873 26.3698 11.9006 26.18 11.9006 25.9538C11.9006 25.8633 11.8879 25.7585 11.863 25.641C11.8377 25.5229 11.7863 25.4098 11.7086 25.3011Z" fill="#FFFAFA" />
                                            <path d="M16.1892 10.0269C15.7941 11.3918 15.2739 12.8655 14.7139 14.2001C15.867 13.7526 17.1205 13.362 18.2979 13.0856C17.553 12.2205 16.8088 11.1402 16.1892 10.0269Z" fill="#FFFAFA" />
                                            <path d="M3.58618 22.6206V30.8965C3.58618 31.4532 4.25929 31.9999 4.94508 31.9999H27.0549C27.7407 31.9999 28.4138 31.4532 28.4138 30.8965V22.6206H3.58618ZM12.6323 26.7194C12.5368 26.9483 12.4033 27.1409 12.2323 27.2965C12.0612 27.4521 11.8549 27.5729 11.6138 27.6584C11.3727 27.7439 11.1056 27.7864 10.8143 27.7864H10.1429V29.793H9.23749V24.2338H10.8364C11.0725 24.2338 11.3065 24.2714 11.5376 24.347C11.7688 24.4225 11.9763 24.5356 12.16 24.6863C12.3437 24.8369 12.4921 25.0195 12.6052 25.233C12.7183 25.4465 12.7751 25.6865 12.7751 25.9536C12.7757 26.2355 12.7277 26.4904 12.6323 26.7194ZM18.1804 28.0319C18.0822 28.3563 17.958 28.6278 17.8069 28.8468C17.6557 29.0658 17.4863 29.238 17.2976 29.3638C17.1089 29.4896 16.9269 29.5834 16.7509 29.6468C16.5749 29.7097 16.4138 29.75 16.2681 29.7676C16.1225 29.7842 16.0143 29.793 15.9437 29.793H13.8394V24.2338H15.5139C15.9818 24.2338 16.3928 24.3083 16.747 24.4562C17.1012 24.6041 17.3958 24.8021 17.6298 25.0482C17.8637 25.2943 18.038 25.5751 18.1539 25.889C18.2692 26.203 18.3271 26.5263 18.3271 26.8584C18.3277 27.3163 18.2786 27.7075 18.1804 28.0319ZM23.1172 24.9202H20.56V26.6703H22.8833V27.2887H20.56V29.793H19.6397V24.2338H23.1172V24.9202Z" fill="#FFFAFA" />
                                            <path d="M16.9738 25.5351C16.8155 25.3514 16.6003 25.203 16.3289 25.0899C16.0574 24.9767 15.7054 24.9199 15.2729 24.9199H14.7449V29.129H15.6425C16.256 29.129 16.6985 28.9332 16.97 28.5409C17.2414 28.1486 17.3771 27.5803 17.3771 26.8361C17.3771 26.6049 17.3496 26.3759 17.2944 26.1497C17.2387 25.9235 17.1322 25.7188 16.9738 25.5351Z" fill="#FFFAFA" />
                                            <path d="M15.8542 5.35847C15.8001 5.37668 15.1204 6.32785 15.9072 7.13282C16.4308 5.96592 15.8779 5.35075 15.8542 5.35847Z" fill="#FFFAFA" />
                                        </svg>
                                        <span>PDF</span>
                                    </button>
                                }

                                {
                                    !(videoLinkTitle && videoResourceLink) &&
                                    <button
                                        type='button'
                                        onClick={() => toggleLinkModal()}
                                        className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.6 28C8.77778 28 7.22222 27.3556 5.93333 26.0667C4.64444 24.7778 4 23.2222 4 21.4C4 20.5111 4.16667 19.6667 4.5 18.8667C4.83333 18.0667 5.31111 17.3556 5.93333 16.7333L10.4 12.3L12.2667 14.1667L7.8 18.6333C7.42222 19.0111 7.13889 19.4389 6.95 19.9167C6.76111 20.3944 6.66667 20.8889 6.66667 21.4C6.66667 22.4889 7.05 23.4167 7.81667 24.1833C8.58333 24.95 9.51111 25.3333 10.6 25.3333C11.1111 25.3333 11.6111 25.2389 12.1 25.05C12.5889 24.8611 13.0222 24.5778 13.4 24.2L17.8333 19.7333L19.7333 21.6333L15.2667 26.0667C14.6444 26.6889 13.9333 27.1667 13.1333 27.5C12.3333 27.8333 11.4889 28 10.6 28ZM13.2333 20.6667L11.3333 18.7667L18.7667 11.3333L20.6667 13.2333L13.2333 20.6667ZM21.6 19.7333L19.7333 17.8333L24.2 13.4C24.5778 13.0222 24.8556 12.6 25.0333 12.1333C25.2111 11.6667 25.3 11.1778 25.3 10.6667C25.3 9.55556 24.9222 8.61111 24.1667 7.83333C23.4111 7.05556 22.4778 6.66667 21.3667 6.66667C20.8556 6.66667 20.3611 6.76111 19.8833 6.95C19.4056 7.13889 18.9778 7.42222 18.6 7.8L14.1667 12.2667L12.2667 10.4L16.7333 5.93333C17.3556 5.31111 18.0667 4.83333 18.8667 4.5C19.6667 4.16667 20.5111 4 21.4 4C23.2222 4 24.7722 4.64444 26.05 5.93333C27.3278 7.22222 27.9667 8.78889 27.9667 10.6333C27.9667 11.5 27.8056 12.3333 27.4833 13.1333C27.1611 13.9333 26.6889 14.6444 26.0667 15.2667L21.6 19.7333Z" fill="#FFFAFA" />
                                        </svg>
                                        <span>Link</span>
                                    </button>
                                }
                            </div>
                            {/* pdf */}
                            {
                                videoResourcePdfName &&
                                <div className='flex justify-between items-center '>
                                    <div className='flex gap-1 items-center text-[#737272] textLabel16 '>
                                        <span className=' '>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.33317 16.5002H14.6665V14.6668H7.33317V16.5002ZM7.33317 12.8335H14.6665V11.0002H7.33317V12.8335ZM5.49984 20.1668C4.99567 20.1668 4.56407 19.9873 4.20505 19.6283C3.84602 19.2693 3.6665 18.8377 3.6665 18.3335V3.66683C3.6665 3.16266 3.84602 2.73107 4.20505 2.37204C4.56407 2.01301 4.99567 1.8335 5.49984 1.8335H12.8332L18.3332 7.3335V18.3335C18.3332 18.8377 18.1537 19.2693 17.7946 19.6283C17.4356 19.9873 17.004 20.1668 16.4998 20.1668H5.49984ZM11.9165 8.25016V3.66683H5.49984V18.3335H16.4998V8.25016H11.9165Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                        <span>
                                            {videoResourcePdfName}
                                        </span>
                                    </div>
                                    <div className='flex gap-4 items-center '>
                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                                            </svg>
                                            <span>Open</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '
                                            onClick={togglePdfModal}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                                            </svg>
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200 '
                                            onClick={() => setValue("videoResourcePdf", null)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            }

                            {/* link */}
                            {videoLinkTitle && videoResourceLink &&
                                <div className='flex justify-between items-center '>
                                    <div className='flex gap-1 items-center textLabel16 '>
                                        <span className='text-[#737272]'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.2875 19.25C6.03472 19.25 4.96528 18.8069 4.07917 17.9208C3.19306 17.0347 2.75 15.9653 2.75 14.7125C2.75 14.1014 2.86458 13.5208 3.09375 12.9708C3.32292 12.4208 3.65139 11.9319 4.07917 11.5042L7.15 8.45625L8.43333 9.73958L5.3625 12.8104C5.10278 13.0701 4.90799 13.3642 4.77813 13.6927C4.64826 14.0212 4.58333 14.3611 4.58333 14.7125C4.58333 15.4611 4.84687 16.099 5.37396 16.626C5.90104 17.1531 6.53889 17.4167 7.2875 17.4167C7.63889 17.4167 7.98264 17.3517 8.31875 17.2219C8.65486 17.092 8.95278 16.8972 9.2125 16.6375L12.2604 13.5667L13.5667 14.8729L10.4958 17.9208C10.0681 18.3486 9.57917 18.6771 9.02917 18.9062C8.47917 19.1354 7.89861 19.25 7.2875 19.25ZM9.09792 14.2083L7.79167 12.9021L12.9021 7.79167L14.2083 9.09792L9.09792 14.2083ZM14.85 13.5667L13.5667 12.2604L16.6375 9.2125C16.8972 8.95278 17.0882 8.6625 17.2104 8.34167C17.3326 8.02083 17.3938 7.68472 17.3938 7.33333C17.3938 6.56944 17.134 5.92014 16.6146 5.38542C16.0951 4.85069 15.4535 4.58333 14.6896 4.58333C14.3382 4.58333 13.9983 4.64826 13.6698 4.77813C13.3413 4.90799 13.0472 5.10278 12.7875 5.3625L9.73958 8.43333L8.43333 7.15L11.5042 4.07917C11.9319 3.65139 12.4208 3.32292 12.9708 3.09375C13.5208 2.86458 14.1014 2.75 14.7125 2.75C15.9653 2.75 17.0309 3.19306 17.9094 4.07917C18.7878 4.96528 19.2271 6.04236 19.2271 7.31042C19.2271 7.90625 19.1163 8.47917 18.8948 9.02917C18.6733 9.57917 18.3486 10.0681 17.9208 10.4958L14.85 13.5667Z" fill="#737272" />
                                            </svg>
                                        </span>
                                        <span className='text-[#5954FF] '>
                                            {videoLinkTitle}
                                        </span>
                                    </div>
                                    <div className='flex gap-4 items-center '>
                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                                            </svg>
                                            <span>Open</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '
                                            onClick={toggleLinkModal}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                                            </svg>
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200 '
                                            onClick={() => {
                                                setValue("videoLinkTitle", "");
                                                setValue("videoResourceLink", "");
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        // <VideoResourcesSection
                        //     register={register}
                        //     errors={errors}
                        //     control={control}
                        //     watch={watch}
                        //     setValue={setValue}
                        // />
                        :
                        <button
                            type='button'
                            onClick={() => setVisibleResourcesInput(true)} className='flex gap-2 px-2 py-1.5 border border-[#663F7E] hover:border-[#351D44] rounded-[8px] textLabel14 text-[#663F7E] hover:text-[#351D44] transition duration-200 '>
                            <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16667 17.5V10.8333H2.5V9.16667H9.16667V2.5H10.8333V9.16667H17.5V10.8333H10.8333V17.5H9.16667Z" fill="currentColor" />
                            </svg>
                            </span>
                            <span>Resources</span>
                        </button>
                }
            </div>
            <div className='w-full border border-[#EDEDED] '></div>

            {/* Modal */}
            <Modal
                isOpen={isPdfModalOpen}
                onClose={togglePdfModal}
                title="Add Pdf"
            >
                <VideoResourcesPdfForm
                    control={control}
                    togglePdfModal={togglePdfModal}
                />
            </Modal>

            <Modal
                isOpen={isLinkModalOpen}
                onClose={() => toggleLinkModal()}
                title="Add Link"
            >
                <VideoResourcesLinkForm
                    onSubmit={handleResourcesLink}
                    register={register}
                    errors={errors}
                    toggleLinkModal={toggleLinkModal}
                // data={
                //     {
                //         linkTitle: "ss",
                //         resourceLink:
                //             "https://www.youtube.com/watch?v=-3KT1f7WZIo&list=RDMMEzPOZpwFFJo&index=4"
                //     }
                // }
                // isEdit={true}
                />
            </Modal>
            {/* </form> */}
        </section>
    )
}

function LectureArticleContent({
    data = null,
    onSubmit,
    isEdit = false,
    register,
    control,
    errors,
    watch,
    setValue = { setValue }
}) {
    const [visibleDescriptonInput, setVisibleDescriptonInput] = useState(false);
    const [visibleResourcesInput, setVisibleResourcesInput] = useState(false);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    const togglePdfModal = () => {
        setIsPdfModalOpen(!isPdfModalOpen);
    };
    const toggleLinkModal = () => {
        setIsLinkModalOpen(!isLinkModalOpen);
    };
    const handleResourcesLink = async ({ data, reset }) => {
        console.log("handleResourcesLink", data);
    }


    const articleResourcePdf = watch ? watch("articleResourcePdf") : null;
    const articleResourcePdfName = articleResourcePdf
        ? typeof articleResourcePdf === "string"
            ? articleResourcePdf.split("/").pop()
            : articleResourcePdf.name
        : null;

    const articleResourceLink = watch ? watch("articleResourceLink") : null;
    const articleLinkTitle = watch ? watch("articleLinkTitle") : null;

    console.log("article", articleResourcePdfName, articleResourceLink, articleLinkTitle);

    // const {
    //     register,
    //     handleSubmit,
    //     setValue,
    //     control,
    //     reset,
    //     formState: { errors },
    // } = useForm({
    //     defaultValues: {
    //         articleDescription: "",
    //         articleLinkTitle: "",
    //         articleResourceLink: "",
    //     },
    // });

    // // Populate values when editing
    // useEffect(() => {
    //     if (isEdit && data) {
    //         setValue("description", data.description || "");
    //         setValue("linkTitle", data.linkTitle || "");
    //         setValue("resourceLink", data.resourceLink || "");
    //     }
    // }, [isEdit, data, setValue]);

    // const submitHandler = (data) => {
    //     console.log(data);
    //     if (onSubmit) onSubmit({ data, reset });
    // };

    return (
        <section>
            {/* <div className="p-6">
                <RichTextEditor
                    placeholder="Compose an epic.."
                    onChange={(html) => console.log(html)}
                />
            </div> */}
            {/* <form
                onSubmit={handleSubmit(submitHandler)}
                className=""> */}
            <div className='w-full border border-[#EDEDED] '></div>
            <div className='py-3 '>
                {/* <RichTextEditor
                        placeholder="Compose an epic.."
                        onChange={(html) => console.log(html)}
                    /> */}
                Article content
            </div>
            <div className='w-full border border-[#EDEDED] '></div>
            <div className='py-3 '>
                {
                    visibleDescriptonInput
                        ?
                        <FormFieldTextarea
                            id="articleDescription"
                            // label="Description"
                            placeholder="Add description"
                            registration={register("articleDescription", {
                                required: "Description is required",
                            })}
                            error={errors.articleDescription}
                            labelClassName="text-[#484848] "
                            // width={674}
                            rows={2}
                            maxLength={200}
                        />
                        :
                        <button
                            type='button' onClick={() => { setVisibleDescriptonInput(true) }} className='flex gap-2 px-2 py-1.5 border border-[#663F7E] hover:border-[#351D44] rounded-[8px] textLabel14 text-[#663F7E] hover:text-[#351D44] transition duration-200 '>
                            <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16667 17.5V10.8333H2.5V9.16667H9.16667V2.5H10.8333V9.16667H17.5V10.8333H10.8333V17.5H9.16667Z" fill="currentColor" />
                            </svg>
                            </span>
                            <span>Description</span>
                        </button>
                }
            </div>
            <div className='w-full border border-[#EDEDED] '></div>
            <div className='py-3 '>
                {
                    visibleResourcesInput
                        ?
                        // <div className='flex flex-col gap-4 '>
                        //     <div className='flex gap-2 justify-center '>
                        //         <button
                        //             type='button'
                        //             onClick={() => togglePdfModal()}
                        //             className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                        //             <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                 <path d="M21.8316 13.9358C21.9138 13.8205 21.9458 13.7466 21.9585 13.7068C21.8906 13.671 21.8007 13.5981 21.3102 13.5981C21.0316 13.5981 20.6818 13.6103 20.311 13.6577C20.7607 14.0037 20.8705 14.1786 21.1646 14.1786C21.2931 14.1791 21.6617 14.1736 21.8316 13.9358Z" fill="#663F7E" />
                        //                 <path d="M11.3301 18.0051C11.4123 17.9792 11.8923 17.7601 12.7866 16.1094C11.607 16.772 11.127 17.3165 11.0928 17.6233C11.0868 17.6741 11.0719 17.8076 11.3301 18.0051Z" fill="#FFFAFA" />
                        //                 <path d="M28.4138 21.5172V7.712C28.4138 7.28938 28.363 6.97655 28.1103 6.72331L21.6899 0.303448C21.4974 0.110897 21.2303 0 20.9572 0H4.94508C4.29073 0 3.58618 0.505379 3.58618 1.61434V21.5172H28.4138ZM20.6896 1.8709C20.6896 1.61821 20.9947 1.49186 21.1735 1.67062L26.7431 7.24028C26.9219 7.41903 26.7956 7.72414 26.5429 7.72414H20.6896V1.8709ZM10.1694 17.52C10.2698 16.6218 11.3804 15.6817 13.4714 14.7239C14.3012 12.9054 15.0907 10.6648 15.5614 8.79283C15.0107 7.59448 14.4756 6.03972 14.8656 5.12772C15.0025 4.80828 15.1729 4.56331 15.4913 4.45738C15.6171 4.41545 15.9349 4.36248 16.0518 4.36248C16.3299 4.36248 16.5743 4.72055 16.7476 4.94124C16.9103 5.14869 17.2794 5.58841 16.5418 8.69407C17.2855 10.2301 18.3393 11.7948 19.3489 12.8662C20.0723 12.7354 20.6946 12.6687 21.2016 12.6687C22.0656 12.6687 22.5892 12.8701 22.8027 13.285C22.9793 13.6281 22.907 14.0292 22.5876 14.4767C22.2803 14.9065 21.8565 15.1338 21.3627 15.1338C20.6918 15.1338 19.9106 14.7101 19.0394 13.8731C17.4742 14.2003 15.6458 14.784 14.1688 15.4301C13.7076 16.4088 13.2656 17.1972 12.854 17.7754C12.2896 18.5688 11.8019 18.9379 11.3191 18.9379C11.1271 18.9379 10.9429 18.8756 10.7856 18.7581C10.2102 18.3261 10.1329 17.8466 10.1694 17.52Z" fill="#FFFAFA" />
                        //                 <path d="M11.7086 25.3011C11.6302 25.193 11.521 25.1025 11.3803 25.0297C11.2396 24.9568 11.0531 24.9204 10.8219 24.9204H10.1433V27.1229H10.9731C11.0834 27.1229 11.1927 27.1041 11.3014 27.0661C11.4095 27.0285 11.5088 26.9668 11.5993 26.8812C11.6898 26.7957 11.7626 26.6765 11.8178 26.5232C11.873 26.3698 11.9006 26.18 11.9006 25.9538C11.9006 25.8633 11.8879 25.7585 11.863 25.641C11.8377 25.5229 11.7863 25.4098 11.7086 25.3011Z" fill="#FFFAFA" />
                        //                 <path d="M16.1892 10.0269C15.7941 11.3918 15.2739 12.8655 14.7139 14.2001C15.867 13.7526 17.1205 13.362 18.2979 13.0856C17.553 12.2205 16.8088 11.1402 16.1892 10.0269Z" fill="#FFFAFA" />
                        //                 <path d="M3.58618 22.6206V30.8965C3.58618 31.4532 4.25929 31.9999 4.94508 31.9999H27.0549C27.7407 31.9999 28.4138 31.4532 28.4138 30.8965V22.6206H3.58618ZM12.6323 26.7194C12.5368 26.9483 12.4033 27.1409 12.2323 27.2965C12.0612 27.4521 11.8549 27.5729 11.6138 27.6584C11.3727 27.7439 11.1056 27.7864 10.8143 27.7864H10.1429V29.793H9.23749V24.2338H10.8364C11.0725 24.2338 11.3065 24.2714 11.5376 24.347C11.7688 24.4225 11.9763 24.5356 12.16 24.6863C12.3437 24.8369 12.4921 25.0195 12.6052 25.233C12.7183 25.4465 12.7751 25.6865 12.7751 25.9536C12.7757 26.2355 12.7277 26.4904 12.6323 26.7194ZM18.1804 28.0319C18.0822 28.3563 17.958 28.6278 17.8069 28.8468C17.6557 29.0658 17.4863 29.238 17.2976 29.3638C17.1089 29.4896 16.9269 29.5834 16.7509 29.6468C16.5749 29.7097 16.4138 29.75 16.2681 29.7676C16.1225 29.7842 16.0143 29.793 15.9437 29.793H13.8394V24.2338H15.5139C15.9818 24.2338 16.3928 24.3083 16.747 24.4562C17.1012 24.6041 17.3958 24.8021 17.6298 25.0482C17.8637 25.2943 18.038 25.5751 18.1539 25.889C18.2692 26.203 18.3271 26.5263 18.3271 26.8584C18.3277 27.3163 18.2786 27.7075 18.1804 28.0319ZM23.1172 24.9202H20.56V26.6703H22.8833V27.2887H20.56V29.793H19.6397V24.2338H23.1172V24.9202Z" fill="#FFFAFA" />
                        //                 <path d="M16.9738 25.5351C16.8155 25.3514 16.6003 25.203 16.3289 25.0899C16.0574 24.9767 15.7054 24.9199 15.2729 24.9199H14.7449V29.129H15.6425C16.256 29.129 16.6985 28.9332 16.97 28.5409C17.2414 28.1486 17.3771 27.5803 17.3771 26.8361C17.3771 26.6049 17.3496 26.3759 17.2944 26.1497C17.2387 25.9235 17.1322 25.7188 16.9738 25.5351Z" fill="#FFFAFA" />
                        //                 <path d="M15.8542 5.35847C15.8001 5.37668 15.1204 6.32785 15.9072 7.13282C16.4308 5.96592 15.8779 5.35075 15.8542 5.35847Z" fill="#FFFAFA" />
                        //             </svg>
                        //             <span>PDF</span>
                        //         </button>
                        //         <button
                        //             type='button'
                        //             onClick={() => toggleLinkModal()}
                        //             className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                        //             <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                 <path d="M10.6 28C8.77778 28 7.22222 27.3556 5.93333 26.0667C4.64444 24.7778 4 23.2222 4 21.4C4 20.5111 4.16667 19.6667 4.5 18.8667C4.83333 18.0667 5.31111 17.3556 5.93333 16.7333L10.4 12.3L12.2667 14.1667L7.8 18.6333C7.42222 19.0111 7.13889 19.4389 6.95 19.9167C6.76111 20.3944 6.66667 20.8889 6.66667 21.4C6.66667 22.4889 7.05 23.4167 7.81667 24.1833C8.58333 24.95 9.51111 25.3333 10.6 25.3333C11.1111 25.3333 11.6111 25.2389 12.1 25.05C12.5889 24.8611 13.0222 24.5778 13.4 24.2L17.8333 19.7333L19.7333 21.6333L15.2667 26.0667C14.6444 26.6889 13.9333 27.1667 13.1333 27.5C12.3333 27.8333 11.4889 28 10.6 28ZM13.2333 20.6667L11.3333 18.7667L18.7667 11.3333L20.6667 13.2333L13.2333 20.6667ZM21.6 19.7333L19.7333 17.8333L24.2 13.4C24.5778 13.0222 24.8556 12.6 25.0333 12.1333C25.2111 11.6667 25.3 11.1778 25.3 10.6667C25.3 9.55556 24.9222 8.61111 24.1667 7.83333C23.4111 7.05556 22.4778 6.66667 21.3667 6.66667C20.8556 6.66667 20.3611 6.76111 19.8833 6.95C19.4056 7.13889 18.9778 7.42222 18.6 7.8L14.1667 12.2667L12.2667 10.4L16.7333 5.93333C17.3556 5.31111 18.0667 4.83333 18.8667 4.5C19.6667 4.16667 20.5111 4 21.4 4C23.2222 4 24.7722 4.64444 26.05 5.93333C27.3278 7.22222 27.9667 8.78889 27.9667 10.6333C27.9667 11.5 27.8056 12.3333 27.4833 13.1333C27.1611 13.9333 26.6889 14.6444 26.0667 15.2667L21.6 19.7333Z" fill="#FFFAFA" />
                        //             </svg>
                        //             <span>Link</span>
                        //         </button>
                        //     </div>
                        //     {/* pdf */}
                        //     <div className='flex justify-between items-center '>
                        //         <div className='flex gap-1 items-center text-[#737272] textLabel16 '>
                        //             <span className=' '>
                        //                 <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M7.33317 16.5002H14.6665V14.6668H7.33317V16.5002ZM7.33317 12.8335H14.6665V11.0002H7.33317V12.8335ZM5.49984 20.1668C4.99567 20.1668 4.56407 19.9873 4.20505 19.6283C3.84602 19.2693 3.6665 18.8377 3.6665 18.3335V3.66683C3.6665 3.16266 3.84602 2.73107 4.20505 2.37204C4.56407 2.01301 4.99567 1.8335 5.49984 1.8335H12.8332L18.3332 7.3335V18.3335C18.3332 18.8377 18.1537 19.2693 17.7946 19.6283C17.4356 19.9873 17.004 20.1668 16.4998 20.1668H5.49984ZM11.9165 8.25016V3.66683H5.49984V18.3335H16.4998V8.25016H11.9165Z" fill="currentColor" />
                        //                 </svg>
                        //             </span>
                        //             <span>
                        //                 mydocMRCOG.pdf
                        //             </span>
                        //         </div>
                        //         <div className='flex gap-4 items-center '>
                        //             <button
                        //                 type='button'
                        //                 className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '>
                        //                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                        //                 </svg>
                        //                 <span>Open</span>
                        //             </button>

                        //             <button
                        //                 type='button'
                        //                 className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '
                        //                 onClick={togglePdfModal}
                        //             >
                        //                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                        //                 </svg>
                        //                 <span>Edit</span>
                        //             </button>

                        //             <button
                        //                 type='button'
                        //                 className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200 '>
                        //                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                        //                 </svg>
                        //                 <span>Delete</span>
                        //             </button>
                        //         </div>
                        //     </div>

                        //     {/* link */}
                        //     <div className='flex justify-between items-center '>
                        //         <div className='flex gap-1 items-center textLabel16 '>
                        //             <span className='text-[#737272]'>
                        //                 <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M7.2875 19.25C6.03472 19.25 4.96528 18.8069 4.07917 17.9208C3.19306 17.0347 2.75 15.9653 2.75 14.7125C2.75 14.1014 2.86458 13.5208 3.09375 12.9708C3.32292 12.4208 3.65139 11.9319 4.07917 11.5042L7.15 8.45625L8.43333 9.73958L5.3625 12.8104C5.10278 13.0701 4.90799 13.3642 4.77813 13.6927C4.64826 14.0212 4.58333 14.3611 4.58333 14.7125C4.58333 15.4611 4.84687 16.099 5.37396 16.626C5.90104 17.1531 6.53889 17.4167 7.2875 17.4167C7.63889 17.4167 7.98264 17.3517 8.31875 17.2219C8.65486 17.092 8.95278 16.8972 9.2125 16.6375L12.2604 13.5667L13.5667 14.8729L10.4958 17.9208C10.0681 18.3486 9.57917 18.6771 9.02917 18.9062C8.47917 19.1354 7.89861 19.25 7.2875 19.25ZM9.09792 14.2083L7.79167 12.9021L12.9021 7.79167L14.2083 9.09792L9.09792 14.2083ZM14.85 13.5667L13.5667 12.2604L16.6375 9.2125C16.8972 8.95278 17.0882 8.6625 17.2104 8.34167C17.3326 8.02083 17.3938 7.68472 17.3938 7.33333C17.3938 6.56944 17.134 5.92014 16.6146 5.38542C16.0951 4.85069 15.4535 4.58333 14.6896 4.58333C14.3382 4.58333 13.9983 4.64826 13.6698 4.77813C13.3413 4.90799 13.0472 5.10278 12.7875 5.3625L9.73958 8.43333L8.43333 7.15L11.5042 4.07917C11.9319 3.65139 12.4208 3.32292 12.9708 3.09375C13.5208 2.86458 14.1014 2.75 14.7125 2.75C15.9653 2.75 17.0309 3.19306 17.9094 4.07917C18.7878 4.96528 19.2271 6.04236 19.2271 7.31042C19.2271 7.90625 19.1163 8.47917 18.8948 9.02917C18.6733 9.57917 18.3486 10.0681 17.9208 10.4958L14.85 13.5667Z" fill="#737272" />
                        //                 </svg>
                        //             </span>
                        //             <span className='text-[#5954FF] '>
                        //                 mydocMRCOG.pdf
                        //             </span>
                        //         </div>
                        //         <div className='flex gap-4 items-center '>
                        //             <button className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '>
                        //                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                        //                 </svg>
                        //                 <span>Open</span>
                        //             </button>

                        //             <button className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '>
                        //                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                        //                 </svg>
                        //                 <span>Edit</span>
                        //             </button>

                        //             <button className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200 '>
                        //                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        //                     <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                        //                 </svg>
                        //                 <span>Delete</span>
                        //             </button>
                        //         </div>
                        //     </div>
                        // </div>
                        <div className='flex flex-col gap-4 '>
                            {/* pdf and link button */}
                            <div className='flex gap-2 justify-center '>
                                {
                                    !articleResourcePdfName &&
                                    <button
                                        type='button'
                                        onClick={() => togglePdfModal()}
                                        className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M21.8316 13.9358C21.9138 13.8205 21.9458 13.7466 21.9585 13.7068C21.8906 13.671 21.8007 13.5981 21.3102 13.5981C21.0316 13.5981 20.6818 13.6103 20.311 13.6577C20.7607 14.0037 20.8705 14.1786 21.1646 14.1786C21.2931 14.1791 21.6617 14.1736 21.8316 13.9358Z" fill="#663F7E" />
                                            <path d="M11.3301 18.0051C11.4123 17.9792 11.8923 17.7601 12.7866 16.1094C11.607 16.772 11.127 17.3165 11.0928 17.6233C11.0868 17.6741 11.0719 17.8076 11.3301 18.0051Z" fill="#FFFAFA" />
                                            <path d="M28.4138 21.5172V7.712C28.4138 7.28938 28.363 6.97655 28.1103 6.72331L21.6899 0.303448C21.4974 0.110897 21.2303 0 20.9572 0H4.94508C4.29073 0 3.58618 0.505379 3.58618 1.61434V21.5172H28.4138ZM20.6896 1.8709C20.6896 1.61821 20.9947 1.49186 21.1735 1.67062L26.7431 7.24028C26.9219 7.41903 26.7956 7.72414 26.5429 7.72414H20.6896V1.8709ZM10.1694 17.52C10.2698 16.6218 11.3804 15.6817 13.4714 14.7239C14.3012 12.9054 15.0907 10.6648 15.5614 8.79283C15.0107 7.59448 14.4756 6.03972 14.8656 5.12772C15.0025 4.80828 15.1729 4.56331 15.4913 4.45738C15.6171 4.41545 15.9349 4.36248 16.0518 4.36248C16.3299 4.36248 16.5743 4.72055 16.7476 4.94124C16.9103 5.14869 17.2794 5.58841 16.5418 8.69407C17.2855 10.2301 18.3393 11.7948 19.3489 12.8662C20.0723 12.7354 20.6946 12.6687 21.2016 12.6687C22.0656 12.6687 22.5892 12.8701 22.8027 13.285C22.9793 13.6281 22.907 14.0292 22.5876 14.4767C22.2803 14.9065 21.8565 15.1338 21.3627 15.1338C20.6918 15.1338 19.9106 14.7101 19.0394 13.8731C17.4742 14.2003 15.6458 14.784 14.1688 15.4301C13.7076 16.4088 13.2656 17.1972 12.854 17.7754C12.2896 18.5688 11.8019 18.9379 11.3191 18.9379C11.1271 18.9379 10.9429 18.8756 10.7856 18.7581C10.2102 18.3261 10.1329 17.8466 10.1694 17.52Z" fill="#FFFAFA" />
                                            <path d="M11.7086 25.3011C11.6302 25.193 11.521 25.1025 11.3803 25.0297C11.2396 24.9568 11.0531 24.9204 10.8219 24.9204H10.1433V27.1229H10.9731C11.0834 27.1229 11.1927 27.1041 11.3014 27.0661C11.4095 27.0285 11.5088 26.9668 11.5993 26.8812C11.6898 26.7957 11.7626 26.6765 11.8178 26.5232C11.873 26.3698 11.9006 26.18 11.9006 25.9538C11.9006 25.8633 11.8879 25.7585 11.863 25.641C11.8377 25.5229 11.7863 25.4098 11.7086 25.3011Z" fill="#FFFAFA" />
                                            <path d="M16.1892 10.0269C15.7941 11.3918 15.2739 12.8655 14.7139 14.2001C15.867 13.7526 17.1205 13.362 18.2979 13.0856C17.553 12.2205 16.8088 11.1402 16.1892 10.0269Z" fill="#FFFAFA" />
                                            <path d="M3.58618 22.6206V30.8965C3.58618 31.4532 4.25929 31.9999 4.94508 31.9999H27.0549C27.7407 31.9999 28.4138 31.4532 28.4138 30.8965V22.6206H3.58618ZM12.6323 26.7194C12.5368 26.9483 12.4033 27.1409 12.2323 27.2965C12.0612 27.4521 11.8549 27.5729 11.6138 27.6584C11.3727 27.7439 11.1056 27.7864 10.8143 27.7864H10.1429V29.793H9.23749V24.2338H10.8364C11.0725 24.2338 11.3065 24.2714 11.5376 24.347C11.7688 24.4225 11.9763 24.5356 12.16 24.6863C12.3437 24.8369 12.4921 25.0195 12.6052 25.233C12.7183 25.4465 12.7751 25.6865 12.7751 25.9536C12.7757 26.2355 12.7277 26.4904 12.6323 26.7194ZM18.1804 28.0319C18.0822 28.3563 17.958 28.6278 17.8069 28.8468C17.6557 29.0658 17.4863 29.238 17.2976 29.3638C17.1089 29.4896 16.9269 29.5834 16.7509 29.6468C16.5749 29.7097 16.4138 29.75 16.2681 29.7676C16.1225 29.7842 16.0143 29.793 15.9437 29.793H13.8394V24.2338H15.5139C15.9818 24.2338 16.3928 24.3083 16.747 24.4562C17.1012 24.6041 17.3958 24.8021 17.6298 25.0482C17.8637 25.2943 18.038 25.5751 18.1539 25.889C18.2692 26.203 18.3271 26.5263 18.3271 26.8584C18.3277 27.3163 18.2786 27.7075 18.1804 28.0319ZM23.1172 24.9202H20.56V26.6703H22.8833V27.2887H20.56V29.793H19.6397V24.2338H23.1172V24.9202Z" fill="#FFFAFA" />
                                            <path d="M16.9738 25.5351C16.8155 25.3514 16.6003 25.203 16.3289 25.0899C16.0574 24.9767 15.7054 24.9199 15.2729 24.9199H14.7449V29.129H15.6425C16.256 29.129 16.6985 28.9332 16.97 28.5409C17.2414 28.1486 17.3771 27.5803 17.3771 26.8361C17.3771 26.6049 17.3496 26.3759 17.2944 26.1497C17.2387 25.9235 17.1322 25.7188 16.9738 25.5351Z" fill="#FFFAFA" />
                                            <path d="M15.8542 5.35847C15.8001 5.37668 15.1204 6.32785 15.9072 7.13282C16.4308 5.96592 15.8779 5.35075 15.8542 5.35847Z" fill="#FFFAFA" />
                                        </svg>
                                        <span>PDF</span>
                                    </button>
                                }

                                {
                                    !(articleLinkTitle && articleResourceLink) &&
                                    <button
                                        type='button'
                                        onClick={() => toggleLinkModal()}
                                        className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.6 28C8.77778 28 7.22222 27.3556 5.93333 26.0667C4.64444 24.7778 4 23.2222 4 21.4C4 20.5111 4.16667 19.6667 4.5 18.8667C4.83333 18.0667 5.31111 17.3556 5.93333 16.7333L10.4 12.3L12.2667 14.1667L7.8 18.6333C7.42222 19.0111 7.13889 19.4389 6.95 19.9167C6.76111 20.3944 6.66667 20.8889 6.66667 21.4C6.66667 22.4889 7.05 23.4167 7.81667 24.1833C8.58333 24.95 9.51111 25.3333 10.6 25.3333C11.1111 25.3333 11.6111 25.2389 12.1 25.05C12.5889 24.8611 13.0222 24.5778 13.4 24.2L17.8333 19.7333L19.7333 21.6333L15.2667 26.0667C14.6444 26.6889 13.9333 27.1667 13.1333 27.5C12.3333 27.8333 11.4889 28 10.6 28ZM13.2333 20.6667L11.3333 18.7667L18.7667 11.3333L20.6667 13.2333L13.2333 20.6667ZM21.6 19.7333L19.7333 17.8333L24.2 13.4C24.5778 13.0222 24.8556 12.6 25.0333 12.1333C25.2111 11.6667 25.3 11.1778 25.3 10.6667C25.3 9.55556 24.9222 8.61111 24.1667 7.83333C23.4111 7.05556 22.4778 6.66667 21.3667 6.66667C20.8556 6.66667 20.3611 6.76111 19.8833 6.95C19.4056 7.13889 18.9778 7.42222 18.6 7.8L14.1667 12.2667L12.2667 10.4L16.7333 5.93333C17.3556 5.31111 18.0667 4.83333 18.8667 4.5C19.6667 4.16667 20.5111 4 21.4 4C23.2222 4 24.7722 4.64444 26.05 5.93333C27.3278 7.22222 27.9667 8.78889 27.9667 10.6333C27.9667 11.5 27.8056 12.3333 27.4833 13.1333C27.1611 13.9333 26.6889 14.6444 26.0667 15.2667L21.6 19.7333Z" fill="#FFFAFA" />
                                        </svg>
                                        <span>Link</span>
                                    </button>
                                }
                            </div>
                            {/* pdf */}
                            {
                                articleResourcePdfName &&
                                <div className='flex justify-between items-center '>
                                    <div className='flex gap-1 items-center text-[#737272] textLabel16 '>
                                        <span className=' '>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.33317 16.5002H14.6665V14.6668H7.33317V16.5002ZM7.33317 12.8335H14.6665V11.0002H7.33317V12.8335ZM5.49984 20.1668C4.99567 20.1668 4.56407 19.9873 4.20505 19.6283C3.84602 19.2693 3.6665 18.8377 3.6665 18.3335V3.66683C3.6665 3.16266 3.84602 2.73107 4.20505 2.37204C4.56407 2.01301 4.99567 1.8335 5.49984 1.8335H12.8332L18.3332 7.3335V18.3335C18.3332 18.8377 18.1537 19.2693 17.7946 19.6283C17.4356 19.9873 17.004 20.1668 16.4998 20.1668H5.49984ZM11.9165 8.25016V3.66683H5.49984V18.3335H16.4998V8.25016H11.9165Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                        <span>
                                            {articleResourcePdfName}
                                        </span>
                                    </div>
                                    <div className='flex gap-4 items-center '>
                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                                            </svg>
                                            <span>Open</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '
                                            onClick={togglePdfModal}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                                            </svg>
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200 '
                                            onClick={() => setValue("articleResourcePdf", null)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            }

                            {/* link */}
                            {articleLinkTitle && articleResourceLink &&
                                <div className='flex justify-between items-center '>
                                    <div className='flex gap-1 items-center textLabel16 '>
                                        <span className='text-[#737272]'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.2875 19.25C6.03472 19.25 4.96528 18.8069 4.07917 17.9208C3.19306 17.0347 2.75 15.9653 2.75 14.7125C2.75 14.1014 2.86458 13.5208 3.09375 12.9708C3.32292 12.4208 3.65139 11.9319 4.07917 11.5042L7.15 8.45625L8.43333 9.73958L5.3625 12.8104C5.10278 13.0701 4.90799 13.3642 4.77813 13.6927C4.64826 14.0212 4.58333 14.3611 4.58333 14.7125C4.58333 15.4611 4.84687 16.099 5.37396 16.626C5.90104 17.1531 6.53889 17.4167 7.2875 17.4167C7.63889 17.4167 7.98264 17.3517 8.31875 17.2219C8.65486 17.092 8.95278 16.8972 9.2125 16.6375L12.2604 13.5667L13.5667 14.8729L10.4958 17.9208C10.0681 18.3486 9.57917 18.6771 9.02917 18.9062C8.47917 19.1354 7.89861 19.25 7.2875 19.25ZM9.09792 14.2083L7.79167 12.9021L12.9021 7.79167L14.2083 9.09792L9.09792 14.2083ZM14.85 13.5667L13.5667 12.2604L16.6375 9.2125C16.8972 8.95278 17.0882 8.6625 17.2104 8.34167C17.3326 8.02083 17.3938 7.68472 17.3938 7.33333C17.3938 6.56944 17.134 5.92014 16.6146 5.38542C16.0951 4.85069 15.4535 4.58333 14.6896 4.58333C14.3382 4.58333 13.9983 4.64826 13.6698 4.77813C13.3413 4.90799 13.0472 5.10278 12.7875 5.3625L9.73958 8.43333L8.43333 7.15L11.5042 4.07917C11.9319 3.65139 12.4208 3.32292 12.9708 3.09375C13.5208 2.86458 14.1014 2.75 14.7125 2.75C15.9653 2.75 17.0309 3.19306 17.9094 4.07917C18.7878 4.96528 19.2271 6.04236 19.2271 7.31042C19.2271 7.90625 19.1163 8.47917 18.8948 9.02917C18.6733 9.57917 18.3486 10.0681 17.9208 10.4958L14.85 13.5667Z" fill="#737272" />
                                            </svg>
                                        </span>
                                        <span className='text-[#5954FF] '>
                                            {articleLinkTitle}
                                        </span>
                                    </div>
                                    <div className='flex gap-4 items-center '>
                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.49967 16.6665L3.33301 15.4998L12.9997 5.83317H7.49967V4.1665H15.833V12.4998H14.1663V6.99984L4.49967 16.6665Z" fill="currentColor" />
                                            </svg>
                                            <span>Open</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#663F7E] hover:text-[#351D44] textLabel14 transition duration-200 '
                                            onClick={toggleLinkModal}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="currentColor" />
                                            </svg>
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            type='button'
                                            className='flex gap-2 items-center text-[#F6433C] hover:text-[#f61008] textLabel14 transition duration-200 '
                                            onClick={() => {
                                                setValue("articleLinkTitle", "");
                                                setValue("articleResourceLink", "");
                                            }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM14.1663 5H5.83301V15.8333H14.1663V5ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z" fill="currentColor" />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        :
                        <button
                            type='button'
                            onClick={() => setVisibleResourcesInput(true)} className='flex gap-2 px-2 py-1.5 border border-[#663F7E] hover:border-[#351D44] rounded-[8px] textLabel14 text-[#663F7E] hover:text-[#351D44] transition duration-200 '>
                            <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16667 17.5V10.8333H2.5V9.16667H9.16667V2.5H10.8333V9.16667H17.5V10.8333H10.8333V17.5H9.16667Z" fill="currentColor" />
                            </svg>
                            </span>
                            <span>Resources</span>
                        </button>
                }
            </div>
            <div className='w-full border border-[#EDEDED] '></div>

            {/* Modal */}
            <Modal
                isOpen={isPdfModalOpen}
                onClose={() => togglePdfModal()}
                title="Add Pdf"
            >
                <ArticleResourcesPdfForm control={control} togglePdfModal={togglePdfModal} />
            </Modal>

            <Modal
                isOpen={isLinkModalOpen}
                onClose={() => toggleLinkModal()}
                title="Add Link"
            >
                <ArticleResourcesLinkForm
                    onSubmit={handleResourcesLink}
                    register={register}
                    errors={errors}
                    toggleLinkModal={toggleLinkModal}
                // data={
                //     {
                //         linkTitle: "ss",
                //         resourceLink:
                //             "https://www.youtube.com/watch?v=-3KT1f7WZIo&list=RDMMEzPOZpwFFJo&index=4"
                //     }
                // }
                // isEdit={true}
                />
            </Modal>
            {/* </form> */}
        </section>
    )
}
// ..................................................
function LectureForm(
    {
        data = null,
        onSubmit,
        isEdit = false,
        openItem,
        newLectureAccordionItemValue
    }
) {
    const [content, setContent] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            lectureName: "",
            // ...............................
            videoDescription: "",
            videoLinkTitle: null,
            videoResourceLink: null,
            videoResourcePdf: null,
            // ...............................
            articleDescription: "",
            articleLinkTitle: null,
            articleResourceLink: null,
            articleResourcePdf: null,
        },
    });

    // Populate values when editing
    useEffect(() => {
        if (isEdit && data) {
            setValue("lectureName", data.lectureName || "");
            // ........................................................
            setValue("videoDescription", data.videoDescription || "");
            setValue("videoLinkTitle", data.videoLinkTitle || null);
            setValue("videoResourceLink", data.videoResourceLink || null);
            setValue("videoResourcePdf", data.videoResourcePdf || null);
            // ........................................................
            setValue("articleDescription", data.articleDescription || "");
            setValue("articleLinkTitle", data.articleLinkTitle || null);
            setValue("articleResourceLink", data.articleResourceLink || null);
            setValue("articleResourcePdf", data.articleResourcePdf || null);
        }
    }, [isEdit, data, setValue]);

    const submitHandler = (data) => {
        console.log("LectureForm", data);
        if (onSubmit) onSubmit({ data, reset });
    };

    const lectureId = data ? data?._id : newLectureAccordionItemValue;

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="">
            <AccordionItem value={lectureId} className="w-full bg-[#FAFAFA] !border border-[#C4C4C4] rounded-[8px] ">
                <AccordionTrigger className="px-4 ">
                    <div className='flex-1 flex justify-between items-center '>
                        <div className='flex gap-1 items-center justify-center '>
                            <p className='text-[#737272] text-lg '>Lecture :</p>
                            <div>
                                <div className='flex gap-1 items-top justify-center '>
                                    <span>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.33341 16.4999H14.6667V14.6666H7.33341V16.4999ZM7.33341 12.8333H14.6667V10.9999H7.33341V12.8333ZM5.50008 20.1666C4.99591 20.1666 4.56432 19.9871 4.20529 19.628C3.84626 19.269 3.66675 18.8374 3.66675 18.3333V3.66659C3.66675 3.16242 3.84626 2.73082 4.20529 2.37179C4.56432 2.01277 4.99591 1.83325 5.50008 1.83325H12.8334L18.3334 7.33325V18.3333C18.3334 18.8374 18.1539 19.269 17.7949 19.628C17.4358 19.9871 17.0042 20.1666 16.5001 20.1666H5.50008ZM11.9167 8.24992V3.66659H5.50008V18.3333H16.5001V8.24992H11.9167Z" fill="#B0B0B0" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Add Lecture name"
                                        onClick={(e) => e.stopPropagation()}
                                        onFocus={(e) => e.stopPropagation()}
                                        {...register("lectureName", {
                                            required: "Lecture name is required",
                                        })}
                                        className="text-[#484848] textLabel16 placeholder:text-[#B0B0B0] bg-transparent border-none outline-none focus:outline-none"
                                    />
                                </div>
                                {errors.lectureName && <p className="text-red-500 text-sm mt-1">{errors.lectureName.message}</p>}
                            </div>
                        </div>

                        {
                            content &&
                            <button
                                type='button'
                                onClick={(e) => {
                                    if (content !== null) {
                                        if (openItem) {
                                            e.stopPropagation();
                                            setContent(null);
                                        }
                                        else {
                                            return
                                        }
                                    }

                                }}
                                className='flex gap-2 px-2 py-1.5 border border-[#663F7E] hover:border-[#351D44] rounded-[8px] textLabel14 text-[#663F7E] hover:text-[#351D44] transition duration-200 '>
                                {/* selected content */}
                                {content === "video" && <p>Video</p>}
                                {content === "article" && <p>Article</p>}
                                <span
                                // onClick={() => {
                                //     setContent(null);
                                // }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.33341 15.8334L4.16675 14.6667L8.83342 10.0001L4.16675 5.33341L5.33341 4.16675L10.0001 8.83342L14.6667 4.16675L15.8334 5.33341L11.1667 10.0001L15.8334 14.6667L14.6667 15.8334L10.0001 11.1667L5.33341 15.8334Z" fill="currentColor" />
                                    </svg>
                                </span>
                            </button>
                        }

                        {
                            content === null &&
                            <button
                                type='button'
                                className='flex gap-2 px-2 py-1.5 border border-[#663F7E] hover:border-[#351D44] rounded-[8px] textLabel14 text-[#663F7E] hover:text-[#351D44] transition duration-200 '>
                                {openItem === lectureId ?
                                    <>
                                        <p>Select content type </p>
                                        <span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.33341 15.8334L4.16675 14.6667L8.83342 10.0001L4.16675 5.33341L5.33341 4.16675L10.0001 8.83342L14.6667 4.16675L15.8334 5.33341L11.1667 10.0001L15.8334 14.6667L14.6667 15.8334L10.0001 11.1667L5.33341 15.8334Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </>
                                    :
                                    <>
                                        <span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.16667 17.5V10.8333H2.5V9.16667H9.16667V2.5H10.8333V9.16667H17.5V10.8333H10.8333V17.5H9.16667Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                        <p>Content</p>
                                    </>
                                }
                            </button>
                        }
                    </div>
                </AccordionTrigger>

                <AccordionContent className="p-2.5 px-4 flex flex-col gap-2 border-t border-[#C4C4C4]">
                    <div >
                        {
                            content === null &&
                            <div className='flex gap-2 justify-center '>
                                <button
                                    type='button'
                                    onClick={() => { setContent("video") }} className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.0999 5.2002C3.97442 5.2002 1.3999 7.77471 1.3999 10.9002V45.1002C1.3999 48.2257 3.97442 50.8002 7.0999 50.8002H48.8999C51.4388 50.8002 53.6143 49.1021 54.341 46.7888C54.5073 46.2544 54.5999 45.6868 54.5999 45.1002V10.9002C54.5999 7.77471 52.0254 5.2002 48.8999 5.2002H7.0999ZM7.0999 9.0002H10.8999V14.7002H5.1999V10.9002C5.1999 10.7672 5.21415 10.6366 5.2379 10.5107C5.41128 9.63433 6.16176 9.0002 7.0999 9.0002ZM14.6999 9.0002H20.3999V14.7002H14.6999V9.0002ZM24.1999 9.0002H31.7999V14.7002H24.1999V9.0002ZM35.5999 9.0002H41.2999V14.7002H35.5999V9.0002ZM45.0999 9.0002H48.8999C49.971 9.0002 50.7999 9.82908 50.7999 10.9002V14.7002H45.0999V9.0002ZM23.6852 19.5438C24.0607 19.5464 24.4257 19.6496 24.7482 19.8399L35.3253 26.1862C35.9625 26.5696 36.3512 27.2571 36.3512 28.0001C36.3512 28.7432 35.9625 29.4307 35.3253 29.8141L24.7482 36.1603C24.0951 36.5517 23.2806 36.5596 22.6196 36.1868C21.9559 35.8113 21.5461 35.1079 21.5461 34.3463V21.6539C21.5461 20.8923 21.9586 20.1889 22.6196 19.8162C22.9448 19.6311 23.3124 19.5385 23.6852 19.5438ZM5.1999 41.3002H10.8999V47.0002H7.0999C6.02879 47.0002 5.1999 46.1713 5.1999 45.1002V41.3002ZM14.6999 41.3002H20.3999V47.0002H14.6999V41.3002ZM24.1999 41.3002H31.7999V47.0002H24.1999V41.3002ZM35.5999 41.3002H41.2999V47.0002H35.5999V41.3002ZM45.0999 41.3002H50.7999V45.1002C50.7999 46.1713 49.971 47.0002 48.8999 47.0002H45.0999V41.3002Z" fill="#FFFAFA" />
                                    </svg>
                                    <span>Video</span>
                                </button>
                                <button
                                    type='button'
                                    onClick={() => { setContent("article") }}
                                    className='flex flex-col gap-1 bg-[#D9D9D9] px-[18px] py-1.5 rounded-[8px] shadow-[inset_1px_4px_4px_0px_#0000001A] textLabel14 text-[#484848] '>
                                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M48.3871 12.5992L40.421 5.12277C39.6538 4.40613 38.6163 4.00264 37.5339 4H10.5001C9.41752 4.00123 8.37967 4.40539 7.61418 5.12383C6.84869 5.84226 6.41806 6.81632 6.41675 7.83234V47.2507C6.41806 48.2667 6.84869 49.2407 7.61418 49.9592C8.37967 50.6776 9.41752 51.0818 10.5001 51.083H45.5001C46.5826 51.0818 47.6205 50.6776 48.386 49.9592C49.1515 49.2407 49.5821 48.2667 49.5834 47.2507V15.3088C49.5806 14.293 49.1507 13.3192 48.3871 12.5992ZM15.1667 12.7596H33.8334C34.2975 12.7596 34.7427 12.9327 35.0709 13.2407C35.399 13.5487 35.5834 13.9665 35.5834 14.4021C35.5834 14.8377 35.399 15.2554 35.0709 15.5634C34.7427 15.8714 34.2975 16.0445 33.8334 16.0445H15.1667C14.7026 16.0445 14.2575 15.8714 13.9293 15.5634C13.6011 15.2554 13.4167 14.8377 13.4167 14.4021C13.4167 13.9665 13.6011 13.5487 13.9293 13.2407C14.2575 12.9327 14.7026 12.7596 15.1667 12.7596ZM40.8334 44.5133H15.1667C14.7026 44.5133 14.2575 44.3402 13.9293 44.0322C13.6011 43.7242 13.4167 43.3065 13.4167 42.8709C13.4167 42.4353 13.6011 42.0175 13.9293 41.7095C14.2575 41.4015 14.7026 41.2284 15.1667 41.2284H40.8334C41.2975 41.2284 41.7427 41.4015 42.0709 41.7095C42.399 42.0175 42.5834 42.4353 42.5834 42.8709C42.5834 43.3065 42.399 43.7242 42.0709 44.0322C41.7427 44.3402 41.2975 44.5133 40.8334 44.5133ZM40.8334 37.9436H15.1667C14.7026 37.9436 14.2575 37.7705 13.9293 37.4625C13.6011 37.1545 13.4167 36.7367 13.4167 36.3011C13.4167 35.8655 13.6011 35.4478 13.9293 35.1398C14.2575 34.8317 14.7026 34.6587 15.1667 34.6587H40.8334C41.2975 34.6587 41.7427 34.8317 42.0709 35.1398C42.399 35.4478 42.5834 35.8655 42.5834 36.3011C42.5834 36.7367 42.399 37.1545 42.0709 37.4625C41.7427 37.7705 41.2975 37.9436 40.8334 37.9436ZM42.5834 29.7314C42.5833 30.167 42.3989 30.5847 42.0707 30.8927C41.7426 31.2006 41.2975 31.3737 40.8334 31.3738H15.1667C14.7027 31.3737 14.2576 31.2006 13.9294 30.8927C13.6013 30.5847 13.4169 30.167 13.4167 29.7314V20.9718C13.4169 20.5362 13.6013 20.1185 13.9294 19.8105C14.2576 19.5025 14.7027 19.3295 15.1667 19.3294H40.8334C41.2975 19.3295 41.7426 19.5025 42.0707 19.8105C42.3989 20.1185 42.5833 20.5362 42.5834 20.9718V29.7314Z" fill="#FFFAFA" />
                                        <path d="M16.9167 22.6143H39.0834V28.089H16.9167V22.6143Z" fill="#FFFAFA" />
                                    </svg>
                                    <span>Article</span>
                                </button>
                            </div>
                        }

                        <div>
                            {
                                content === "video" && <LectureVideoContent
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                />
                            }
                            {
                                content === "article" && <LectureArticleContent
                                    register={register}
                                    control={control}
                                    errors={errors}
                                    watch={watch}
                                    setValue={setValue}
                                />
                            }
                        </div>
                    </div>
                    <FormButton className={"!mt-[32px] "} label="Resource" />
                </AccordionContent>
            </AccordionItem>
        </form>
    )
}

function CurriculumLecture({ data = null, newLectureAccordionItemValue }) {
    const [openItem, setOpenItem] = useState(null);
    const [newLectures, setNewLectures] = useState([]); // array to track dynamic forms

    useEffect(() => {
        if (data) {
            setOpenItem(data[0]?._id);
        } else {
            setOpenItem(newLectureAccordionItemValue);
        }
    }, [data]);

    const handleAddLecture = () => {
        const newKey = `new_lecture_${Date.now()}`; // unique key each time
        setNewLectures((prev) => [...prev, newKey]);
        setOpenItem(newKey); //  auto-open the newly added form
    };

    return (
        <section className='space-y-6'>
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-6"
                value={openItem}
                onValueChange={setOpenItem}
            >
                {/* Existing lectures from data */}
                {data?.map((lecture) => (
                    <LectureForm
                        key={lecture._id}
                        data={lecture}
                        onSubmit={(v) => { }}
                        isEdit={true}
                        openItem={openItem}
                    />
                ))}

                {/* Initial empty form when no data */}
                {!data && (
                    <LectureForm
                        onSubmit={(v) => { }}
                        openItem={openItem}
                        newLectureAccordionItemValue={newLectureAccordionItemValue}
                    />
                )}

                {/* Dynamically rendered new lecture forms */}
                {newLectures.map((lectureKey) => (
                    <LectureForm
                        key={lectureKey}
                        onSubmit={(v) => { }}
                        openItem={openItem}
                        newLectureAccordionItemValue={lectureKey}
                    />
                ))}
            </Accordion>

            <button
                onClick={handleAddLecture}
                className="flex gap-2.5 items-center justify-center text-[#663F7E] hover:text-[#351D44] textLabel16 transition duration-200"
            >
                <span>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0833 19.25V11.9167H2.75V10.0833H10.0833V2.75H11.9167V10.0833H19.25V11.9167H11.9167V19.25H10.0833Z" fill="currentColor" />
                    </svg>
                </span>
                <span>Lecture</span>
            </button>
        </section>
    );
}

function CurriculumSection(
    {
        data = null,
        onSubmit,
        isEdit = false
    }
) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            sectionName: "",
        },
    });

    // Populate values when editing
    useEffect(() => {
        if (isEdit && data) {
            setValue("sectionName", data.sectionName || "");
        }
    }, [isEdit, data, setValue]);

    const submitHandler = (data) => {
        console.log("Curriculum", data);
        if (onSubmit) onSubmit({ data, reset });
    };

    return (
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="">
            <div className='flex gap-1 items-center justify-center '>
                <p className='text-[#9C9C9C] text-lg '>Section : {" "}</p>
                <div>
                    <div className='flex gap-1 items-center justify-center '>
                        <span>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.33317 16.4999H14.6665V14.6666H7.33317V16.4999ZM7.33317 12.8333H14.6665V10.9999H7.33317V12.8333ZM5.49984 20.1666C4.99567 20.1666 4.56407 19.9871 4.20505 19.628C3.84602 19.269 3.6665 18.8374 3.6665 18.3333V3.66659C3.6665 3.16242 3.84602 2.73082 4.20505 2.37179C4.56407 2.01277 4.99567 1.83325 5.49984 1.83325H12.8332L18.3332 7.33325V18.3333C18.3332 18.8374 18.1537 19.269 17.7946 19.628C17.4356 19.9871 17.004 20.1666 16.4998 20.1666H5.49984ZM11.9165 8.24992V3.66659H5.49984V18.3333H16.4998V8.24992H11.9165Z" fill="#B0B0B0" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Add Section name"
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                            {...register("sectionName", {
                                required: "Section name is required",
                            })}
                            className="text-[#484848] textLabel16 placeholder:text-[#B0B0B0] bg-transparent border-none outline-none focus:outline-none"
                        />
                    </div>
                    {errors.sectionName && <p className="text-red-500 text-sm mt-1">{errors.sectionName.message}</p>}
                </div>
            </div>
        </form>
    )
}

// const data=[
//     {
//         _id: "1",
//         sectionName: "section1",
//         lectures: [
//             {
//                 _id: "1",
//                 lectureName: "Lecture 1",
//                 videoDescription: "dddd",
//                 videoLinkTitle: "sss",
//                 videoResourceLink: "https://tiptap.dev/",
//                 articleDescription: "hiiii",
//                 articleLinkTitle: "hiii",
//                 articleResourceLink: "https://tiptap.dev/"
//             },
//             {
//                 _id: "2",
//                 lectureName: "Lecture 2",
//                 videoDescription: "eee",
//                 videoLinkTitle: "sss",
//                 videoResourceLink: "https://tiptap.dev/",
//                 articleDescription: "hiiii",
//                 articleLinkTitle: "hiii",
//                 articleResourceLink: "https://tiptap.dev/"
//             },
//         ]
//     },
//     {
//         _id: "2",
//         sectionName: "section2",
//         lectures: [
//             {
//                 _id: "1",
//                 lectureName: "Lecture 1",
//                 videoDescription: "dddd",
//                 videoLinkTitle: "sss",
//                 videoResourceLink: "https://tiptap.dev/",
//                 articleDescription: "hiiii",
//                 articleLinkTitle: "hiii",
//                 articleResourceLink: "https://tiptap.dev/"
//             },
//             {
//                 _id: "2",
//                 lectureName: "Lecture 2",
//                 videoDescription: "eee",
//                 videoLinkTitle: "sss",
//                 videoResourceLink: "https://tiptap.dev/",
//                 articleDescription: "hiiii",
//                 articleLinkTitle: "hiii",
//                 articleResourceLink: "https://tiptap.dev/"
//             },
//         ]
//     }]


// const data = [
//     {
//         _id: "1",
//         sectionName: "section1",
//         lectures: [
//             {
//                 _id: "1",
//                 lectureName: "Lecture 1",
//                 videoDescription: "Video description",
//                 videoLinkTitle: "Tiptap",
//                 videoResourceLink: "https://tiptap.dev/",
//                 videoResourcePdf: {},
//                 articleDescription: "Arcticle description",
//                 articleLinkTitle: "Tiptap",
//                 articleResourceLink: "https://tiptap.dev/",
//                 articleResourcePdf: {},
//                 lessonVideo: {}
//             },
//         ]
//     }
// ]

export default function Curriculum({
    data = null
}) {
    const [newSections, setNewSections] = useState([]);

    const handleAddSection = () => {
        const newKey = `new_section_${Date.now()}`;
        setNewSections((prev) => [...prev, newKey]);
    };

    return (
        <section className='space-y-6'>
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-6"
                defaultValue={data?.[0]?._id ?? newSections[0]}
            >
                {/* Existing sections — only renders if data exists */}
                {data?.map((section) => (
                    <AccordionItem
                        key={section._id}
                        value={section._id}
                        className="!border border-[#B683D5] rounded-[12px] px-4"
                    >
                        <AccordionTrigger>
                            <CurriculumSection
                                data={{ sectionName: section.sectionName }}
                                onSubmit={(v) => { }}
                                isEdit={true}
                            />
                        </AccordionTrigger>
                        <AccordionContent className="ps-[60px] flex flex-col gap-2">
                            <CurriculumLecture data={section.lectures} />
                        </AccordionContent>
                    </AccordionItem>
                ))}

                {/* New sections — works whether data exists or not */}
                {newSections.map((sectionKey) => (
                    <AccordionItem
                        key={sectionKey}
                        value={sectionKey}
                        className="!border border-[#B683D5] rounded-[12px] px-4"
                    >
                        <AccordionTrigger>
                            <CurriculumSection onSubmit={(v) => { }} />
                        </AccordionTrigger>
                        <AccordionContent className="ps-[60px] flex flex-col gap-2">
                            <CurriculumLecture
                                newLectureAccordionItemValue={`${sectionKey}_first_lecture`}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <button
                onClick={handleAddSection}
                className="flex gap-2.5 items-center justify-center text-[#663F7E] hover:text-[#351D44] textLabel16 transition duration-200"
            >
                <span>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0833 19.25V11.9167H2.75V10.0833H10.0833V2.75H11.9167V10.0833H19.25V11.9167H11.9167V19.25H10.0833Z" fill="currentColor" />
                    </svg>
                </span>
                <span>Section</span>
            </button>
        </section>
    );
}