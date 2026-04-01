import React from "react";

const Loader = ({ children, isLoading = false, message = "Loading..." }) => {
  if (isLoading) {
    return (
      <div className="w-full relative min-h-64 flex flex-col items-center justify-center cursor-wait">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B88934] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#B88934] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#B88934] animate-bounce" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loader;
