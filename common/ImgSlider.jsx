"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRef, useState } from "react";
import Image from "next/image";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import SliderLeftArrowIcon from "@assets/icons/sliderLeftArrowIcon";
import SliderRightArrowIcon from "@assets/icons/SliderRightArrowIcon";

export default function ConferenceSlider({ posters }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative mx-3">
      <div
        className={`w-10/12 mx-auto`}
        // style={{ maxWidth: `${imgWidth ? imgWidth : 418}px` }}
      >
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          loop={true}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          modules={[Navigation]}
          className="rounded-xl overflow-hidden"
        >
          {posters?.map((img, index) => (
            <SwiperSlide key={index}>
              <Image
                src={img}
                alt={`Poster ${index + 1}`}
                className="w-full h-auto object-cover"
                width={418}
                height={591}
                priority={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Clickable Slide Number Indicators */}
      <div className="mt-4 w-fit mx-auto px-2 py-1.5 bg-[#929292] rounded-[30px] flex gap-3">
        {posters?.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideToLoop(i)}
            className={`w-3 h-3 rounded-full transition-colors ${
              activeIndex === i ? "bg-white" : "bg-[#E5E5E5]"
            }`}
          ></button>
        ))}
      </div>

      {/* Custom Navigation Arrows */}
      <div className="absolute top-1/2 left-[-25px] -translate-y-1/2 z-10">
        <button className="custom-prev cursor-pointer">
          <SliderLeftArrowIcon />
        </button>
      </div>
      <div className="absolute top-1/2 right-[-25px] -translate-y-1/2 z-10">
        <button className="custom-next cursor-pointer">
          <SliderRightArrowIcon />
        </button>
      </div>
    </div>
  );
}
