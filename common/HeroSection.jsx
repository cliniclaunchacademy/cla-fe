import React from "react";

const HeroSection = ({ sectionName }) => {
  return (
    <div className="mx-4 min-h-[286px] heroBgImg rounded-[30px] py-[111px] md:py-0 md:pl-[104px] md:pt-[152px]">
      <h2 className="responsiveTextDisplay56 text-[#F8F8F8] text-center md:text-start ">
        {sectionName}
      </h2>
    </div>
  );
};

export default HeroSection;
