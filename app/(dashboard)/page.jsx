"use client";

import Image from "next/image";
import discordImg from "@assets/images/cla-discord.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useQuery } from "@tanstack/react-query";
import {
  getStudentDashboardStats,
  getContinueLearning,
  getDashboardBanners,
  getCommunityBanner,
  getRecentActivity,
} from "apis/student-dashboard.api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@common/Loader";

const staticCarouselImages = [
  "/assets/images/dashboard/carousel/CLA Main banner 2.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 1 web.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 2 web.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 3 web.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 4 web.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 5 web.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 6 web.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 7 web.jpg",
  "/assets/images/dashboard/carousel/CLA Ad 8 web.jpg",
];

const ProgressBar = ({ percentage = 14 }) => {
  const filledWidth = (68 * percentage) / 100;

  return (
    <div className="pt-[7px] flex gap-5 items-center">
      <svg width="68" height="7" viewBox="0 0 68 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_69_6730)">
          <rect width="68" height="7" rx="3.5" fill="#313335" />
          <rect width={filledWidth} height="7" fill="#B88934" />
        </g>
        <defs>
          <clipPath id="clip0_69_6730">
            <rect width="68" height="7" rx="3.5" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span className="text-[#FFFFFF] textBody14 !font-semibold">{percentage}%</span>
    </div>
  );
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  const { data: statsData } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStudentDashboardStats,
  });

  const { data: continueLearningData, isLoading: isContinueLoading } = useQuery({
    queryKey: ["dashboard-continue-learning"],
    queryFn: getContinueLearning,
  });

  const { data: bannersData, isLoading: isBannersLoading } = useQuery({
    queryKey: ["dashboard-banners"],
    queryFn: getDashboardBanners,
  });

  const { data: communityData } = useQuery({
    queryKey: ["dashboard-community-banner"],
    queryFn: getCommunityBanner,
  });

  const { data: activityData, isLoading: isActivityLoading } = useQuery({
    queryKey: ["dashboard-recent-activity"],
    queryFn: getRecentActivity,
  });

  const stats = statsData?.data?.stats;
  const continueLearning = continueLearningData?.data?.continueLearning;
  const apiBanners = (bannersData?.data?.banners || []).filter((b) => b.status === "active");
  const carouselImages = isBannersLoading
    ? []
    : apiBanners.length > 0
      ? apiBanners.map((b) => b.imageUrl)
      : staticCarouselImages;
  const discordUrl = communityData?.data?.discordInviteUrl;
  const activities = activityData?.data?.activities || [];

  return (
    <section className="w-full flex flex-col gap-y-10 px-9 py-10">
      <div>
        <h3 className="text-[#EFEFEE] textDisplay40 mb-3">
          Welcome back, {username || "there"}!
        </h3>
        <p className="text-[#ABADAF] textBody18">
          Continue your learning journey at Clinic Launch Academy
        </p>
      </div>

      {/* Carousel */}
      <div
        className="w-full rounded-[16px] overflow-hidden"
        style={{
          "--swiper-pagination-color": "#B88934",
          "--swiper-pagination-bullet-inactive-color": "#B88934",
          "--swiper-pagination-bullet-inactive-opacity": "0.35",
        }}
      >
        {isBannersLoading ? (
          <div
            className="w-full rounded-[16px] overflow-hidden relative"
            style={{ aspectRatio: "16 / 5.5" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "#1C1E20" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #26282A 50%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "bannerShimmer 1.6s ease-in-out infinite",
              }}
            />
          </div>
        ) : carouselImages.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={1200}
            pagination={{ clickable: true }}
            loop={carouselImages.length > 1}
            className="w-full"
          >
            {carouselImages.map((src, index) => (
              <SwiperSlide key={index}>
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>

      {/* Stats cards — 3 columns (watch time removed) */}
      <div
        className="grid justify-between gap-[34px]
        [grid-template-columns:repeat(1,minmax(0,1fr))]
        sm:[grid-template-columns:repeat(2,minmax(0,1fr))]
        lg:[grid-template-columns:repeat(3,minmax(0,1fr))]"
      >
        {/* Courses Started */}
        <div className="w-full border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-[#ABADAF] textHeading16">Courses Started</p>
            <p className="text-[#EFEFEE] textHeading28 !font-bold">
              {stats?.enrolled ?? "—"}
            </p>
          </div>
          <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4C15.2044 4 14.4415 4.3163 13.8789 4.87891C13.3163 5.44152 13 6.20435 13 7V17.5371C13.603 17.1889 14.2916 17 15 17H21V4H16ZM3 17H9C9.70844 17 10.397 17.1889 11 17.5371V7C11 6.20435 10.6837 5.44152 10.1211 4.87891C9.55849 4.3163 8.79565 4 8 4H3V17ZM23 17C23 17.5304 22.7891 18.039 22.4141 18.4141C22.039 18.7891 21.5304 19 21 19H15C14.4696 19 13.961 19.2109 13.5859 19.5859C13.2109 19.961 13 20.4696 13 21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21C11 20.4696 10.7891 19.961 10.4141 19.5859C10.039 19.2109 9.53043 19 9 19H3C2.46957 19 1.96101 18.7891 1.58594 18.4141C1.21086 18.039 1 17.5304 1 17V4C1 3.46957 1.21086 2.96101 1.58594 2.58594C1.96101 2.21086 2.46957 2 3 2H8C9.32608 2 10.5975 2.52716 11.5352 3.46484C11.7036 3.63332 11.8587 3.81256 12 4.00098C12.1413 3.81256 12.2964 3.63332 12.4648 3.46484C13.4025 2.52716 14.6739 2 16 2H21C21.5304 2 22.039 2.21086 22.4141 2.58594C22.7891 2.96101 23 3.46957 23 4V17Z" fill="#B88934" />
            </svg>
          </div>
        </div>

        {/* Courses Completed */}
        <div className="w-full border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-[#ABADAF] textHeading16">Courses Completed</p>
            <p className="text-[#EFEFEE] textHeading28 !font-bold">
              {stats?.completed ?? "—"}
            </p>
          </div>
          <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 6.5C21 6.10218 20.8419 5.72076 20.5605 5.43945C20.2792 5.15815 19.8978 5 19.5 5H19V8H19.5C19.8978 8 20.2792 7.84185 20.5605 7.56055C20.8419 7.27924 21 6.89782 21 6.5ZM13 15.9268C12.6707 15.9743 12.3367 16 12 16C11.6633 16 11.3293 15.9743 11 15.9268V16.2969C10.9943 16.8108 10.8569 17.3153 10.6006 17.7607C10.3572 18.1836 10.0133 18.5387 9.60156 18.7988C9.1098 19.1673 8.7094 19.6441 8.43164 20.1924C8.30087 20.4506 8.19981 20.7217 8.12793 21H15.8721C15.8002 20.7217 15.6991 20.4506 15.5684 20.1924C15.2905 19.6438 14.8895 19.1673 14.3975 18.7988C13.986 18.5387 13.6426 18.1833 13.3994 17.7607C13.1431 17.3153 13.0057 16.8108 13 16.2969V15.9268ZM3 6.5C3 6.89782 3.15815 7.27924 3.43945 7.56055C3.72076 7.84185 4.10218 8 4.5 8H5V5H4.5C4.10218 5 3.72076 5.15815 3.43945 5.43945C3.15815 5.72076 3 6.10218 3 6.5ZM7 3V9C7 10.3261 7.52716 11.5975 8.46484 12.5352C9.40253 13.4728 10.6739 14 12 14C13.3261 14 14.5975 13.4728 15.5352 12.5352C16.4728 11.5975 17 10.3261 17 9V3H7ZM19.5 3C20.4283 3 21.3182 3.36901 21.9746 4.02539C22.631 4.68177 23 5.57174 23 6.5C23 7.42826 22.631 8.31823 21.9746 8.97461C21.3182 9.63099 20.4283 10 19.5 10H18.9268C18.7121 11.4867 18.0249 12.8755 16.9502 13.9502C16.3783 14.5221 15.7171 14.9841 15 15.3242V16.2754L15.0098 16.4023C15.0274 16.5288 15.0687 16.6513 15.1328 16.7627C15.197 16.8742 15.2822 16.9719 15.3828 17.0508L15.4883 17.123L15.5713 17.1787C16.321 17.7341 16.931 18.4567 17.3525 19.2891C17.6262 19.8294 17.8137 20.4065 17.9141 21H20C20.5523 21 21 21.4477 21 22C21 22.5523 20.5523 23 20 23H4C3.44772 23 3 22.5523 3 22C3 21.4477 3.44772 21 4 21H6.08594C6.18629 20.4065 6.37382 19.8294 6.64746 19.2891C7.06905 18.4567 7.67898 17.7341 8.42871 17.1787L8.51172 17.123C8.65889 17.0353 8.78173 16.9112 8.86719 16.7627C8.95251 16.6144 8.99804 16.4465 9 16.2754V15.3242C8.28295 14.9841 7.6217 14.5221 7.0498 13.9502C5.97512 12.8755 5.28786 11.4867 5.07324 10H4.5C3.57174 10 2.68177 9.63099 2.02539 8.97461C1.36901 8.31823 1 7.42826 1 6.5C1 5.57174 1.36901 4.68177 2.02539 4.02539C2.68177 3.36901 3.57174 3 4.5 3H5C5 2.46957 5.21087 1.96101 5.58594 1.58594C5.96101 1.21086 6.46957 1 7 1H17C17.5304 1 18.039 1.21086 18.4141 1.58594C18.7891 1.96101 19 2.46957 19 3H19.5Z" fill="#B88934" />
            </svg>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="w-full border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-[#ABADAF] textHeading16">Lessons Completed</p>
            <p className="text-[#EFEFEE] textHeading28 !font-bold">
              {stats?.lessonsCompleted ?? "—"}
            </p>
          </div>
          <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM15 11.999L10.0029 9.00195L10 9V15L10.0029 14.998L15 12.001L15.002 12L15 11.999ZM17.002 12C17.002 12.3464 16.9123 12.6871 16.7412 12.9883C16.5705 13.2887 16.3239 13.5386 16.0273 13.7158L16.0283 13.7168L11.0312 16.7139L11.0303 16.7129C10.7271 16.8953 10.3812 16.9951 10.0273 17C9.67243 17.0049 9.32247 16.9153 9.01367 16.7402C8.70475 16.5651 8.44767 16.3101 8.26953 16.0029C8.0916 15.6959 7.99861 15.347 8 14.9922V9.00293C7.99948 8.64906 8.09274 8.30113 8.27051 7.99512C8.44879 7.68827 8.70583 7.43463 9.01465 7.25977C9.32349 7.08489 9.67344 6.99501 10.0283 7C10.3818 7.00501 10.7274 7.10404 11.0303 7.28613H11.0312L16.0264 10.2822L16.1348 10.3516C16.3837 10.5226 16.5914 10.7481 16.7412 11.0117C16.9123 11.3129 17.002 11.6536 17.002 12ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" fill="#B88934" />
            </svg>
          </div>
        </div>

        {/* Watch Time — commented out until backend adds watchTimeMinutes to stats */}
        {/* <div className="w-full max-w-[324px] border-2 border-[#26282A] rounded-[16px] bg-[#1C1E20] p-[18px] flex lg:flex-col 2xl:flex-row gap-5 justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-[#ABADAF] textHeading16">Watch Time</p>
            <p className="text-[#EFEFEE] textHeading28 !font-bold">0h</p>
            <p className="text-[#ABADAF] textHeading16">0 minutes total</p>
          </div>
          <div className="w-[44px] h-[44px] rounded-full bg-[#2E2D26] flex items-center justify-center text-[#B88934]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12ZM11 6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V11.3818L16.4473 13.1055C16.9412 13.3525 17.1415 13.9533 16.8945 14.4473C16.6475 14.9412 16.0467 15.1415 15.5527 14.8945L11.5527 12.8945C11.214 12.7251 11 12.3788 11 12V6ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" fill="#B88934" />
            </svg>
          </div>
        </div> */}
      </div>

      {/* Learning & Community */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[43px]">
        {/* Continue Learning */}
        <div>
          <h5 className="text-[#EFEFEE] textHeading20 mb-8">Continue Learning</h5>
          {isContinueLoading ? (
            <Loader isLoading={true} />
          ) : continueLearning ? (
            <div className="w-full border-2 border-[#26282A] rounded-[16px] py-3 px-5 bg-[#1C1E20]">
              <div className="text-[#DFE1E3]">
                <div className="flex items-stretch gap-2 mb-3">
                  <button
                    onClick={() =>
                      router.push(
                        `/courses/courseVideoPlayer?courseId=${continueLearning.courseId}&lessonId=${continueLearning.lessonId}`
                      )
                    }
                    className="w-[52px] shrink-0 rounded-[6px] bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] flex items-center justify-center transition duration-200 [&_path]:fill-[#1C1E20]"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33203 3.45952V17.0014C3.33203 17.7748 4.17242 18.2555 4.83905 17.8634L16.0689 11.2575C16.718 10.8757 16.7281 9.94056 16.0874 9.54482L4.85752 2.60872C4.1913 2.19723 3.33203 2.67646 3.33203 3.45952Z" fill="#0A0A0A" />
                    </svg>
                  </button>
                  <div>
                    <p className="textBody18 !font-semibold mb-1">{continueLearning.courseTitle}</p>
                    <p className="textBody16 text-[#ABADAF]">{continueLearning.lessonTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex-1 h-[7px] rounded-full bg-[#313335] overflow-hidden">
                    <div
                      className="h-full bg-[#B88934] rounded-full transition-all duration-300"
                      style={{ width: `${continueLearning.progressPercent ?? 0}%` }}
                    />
                  </div>
                  <span className="text-[#FFFFFF] textBody14 !font-semibold shrink-0">
                    {continueLearning.progressPercent ?? 0}%
                  </span>
                </div>
                <p className="textBody14 text-[#ABADAF]">
                  {continueLearning.completedLessons ?? 0} of {continueLearning.totalLessons ?? 0} lessons completed
                  {" · "}last watched {timeAgo(continueLearning.lastWatched)}
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-[#26282A] rounded-[16px] py-3 px-5 bg-[#1C1E20]">
              <p className="text-[#ABADAF] textBody16">No activity yet. Start a course to begin learning!</p>
            </div>
          )}
        </div>

        {/* Community */}
        <div>
          <h5 className="text-[#EFEFEE] textHeading20 mb-8">Join our community</h5>
          {discordUrl ? (
            <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="rounded-[16px] block">
              <Image style={{pointer: "cursor", borderRadius: "16px"}} src={discordImg} alt="Join Discord" />
            </a>
          ) : (
            <button className="rounded-[16px]">
              <Image src={discordImg} alt="Join Discord" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h5 className="text-[#EFEFEE] textHeading20 mb-8">Recent Activity</h5>
        <div className="border border-[#313335] rounded-[14px] bg-[#1C1E20]">
          {isActivityLoading ? (
            <Loader isLoading={true} />
          ) : activities.length === 0 ? (
            <div className="px-5 py-6">
              <p className="text-[#ABADAF] textBody16">No recent activity yet.</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity._id}
                className="px-5 py-[17.5px] flex justify-between items-center gap-3 flex-wrap border-b border-[#26282A] last:border-b-0"
              >
                <div className="flex gap-5 items-center">
                  <button
                    onClick={() =>
                      router.push(
                        `/courses/courseVideoPlayer?courseId=${activity.course?._id}&lessonId=${activity.lesson?._id}`
                      )
                    }
                    className="w-[42px] h-[42px] shrink-0 rounded-[10px] bg-[#232420] hover:bg-[#B88934] flex items-center justify-center text-[#AE9060] hover:text-[#0A0A0A] transition duration-200"
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip_activity)">
                        <path d="M19.2513 11.0001C19.2513 6.44373 15.5577 2.75008 11.0013 2.75008C6.44495 2.75008 2.7513 6.44373 2.7513 11.0001C2.7513 15.5564 6.44495 19.2501 11.0013 19.2501C15.5577 19.2501 19.2513 15.5564 19.2513 11.0001ZM13.7513 10.9992L9.17065 8.25187L9.16797 8.25008V13.7501L9.17065 13.7483L13.7513 11.001L13.7531 11.0001L13.7513 10.9992ZM15.5864 11.0001C15.5864 11.3176 15.5043 11.6299 15.3474 11.906C15.1909 12.1814 14.9649 12.4104 14.693 12.5729L14.6939 12.5738L10.1133 15.3211L10.1124 15.3202C9.83444 15.4874 9.51739 15.5789 9.19303 15.5834C8.8677 15.5879 8.5469 15.5057 8.26383 15.3453C7.98066 15.1848 7.745 14.951 7.58171 14.6694C7.4186 14.388 7.33336 14.0682 7.33464 13.7429V8.25277C7.33416 7.92839 7.41964 7.60945 7.5826 7.32894C7.74603 7.04766 7.98165 6.81516 8.26473 6.65487C8.54784 6.49456 8.86862 6.41217 9.19393 6.41675C9.51791 6.42134 9.83472 6.51212 10.1124 6.67904H10.1133L14.6921 9.42546L14.7915 9.48901C15.0197 9.64583 15.2101 9.85253 15.3474 10.0942C15.5043 10.3702 15.5864 10.6826 15.5864 11.0001ZM21.0846 11.0001C21.0846 16.569 16.5702 21.0834 11.0013 21.0834C5.43243 21.0834 0.917969 16.569 0.917969 11.0001C0.917969 5.43121 5.43243 0.916748 11.0013 0.916748C16.5702 0.916748 21.0846 5.43121 21.0846 11.0001Z" fill="currentColor" />
                      </g>
                      <defs>
                        <clipPath id="clip_activity">
                          <rect width="22" height="22" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  <div>
                    <p className="text-[#EFEFEE] textBody18 !font-semibold mb-0.5">
                      {activity.lesson?.title}
                    </p>
                    <p className="text-[#ABADAF]">{activity.course?.title}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`textLabel12 px-2 py-0.5 rounded-full ${activity.action === "completed" ? "bg-[#1A2E1A] text-[#6FCF6F]" : "bg-[#232420] text-[#ABADAF]"}`}>
                    {activity.action}
                  </span>
                  <p className="text-[#ABADAF] textBody14">{timeAgo(activity.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
