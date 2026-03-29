import React from "react";

const Loader = ({ children, isLoading = false, message = "Loading..." }) => {
  if (isLoading) {
    return (
      <div className="w-full relative min-h-64 flex flex-col items-center justify-center cursor-wait">
        <img src="/loading.gif" alt="Funny GIF" />
      </div>
    );
  }

  return <>{children}</>;
};

export default Loader;
