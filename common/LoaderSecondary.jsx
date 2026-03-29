import React from "react";

const LoaderSecondary = ({ children, isLoading = false, message = "Loading..." }) => {
  if (isLoading) {
    return (
      <div className="py-8">
        {message}
      </div>
    );
  }

  return <>{children}</>;
};

export default LoaderSecondary;
