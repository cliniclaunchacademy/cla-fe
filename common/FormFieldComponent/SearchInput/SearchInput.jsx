"use client";

const SearchInput = ({
  value,
  onChange,
  placeholder = "",
  onSubmit,
}) => {
  const handleClear = () => {
    onChange({ target: { value: "" } });
  };
  return (
    <div className="w-full h-[46px] max-w-[1067px] flex items-center justify-center rounded-[10px] bg-[#17191B] border-[2px] border-[#ABADAF] focus-within:border-[#ABADAF] transition duration-100 px-[14px] text-[#ABADAF] focus-within:text-[#DFE1E3] ">
      <button
        type="button"
        onClick={onSubmit}
        className=""
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 8.25C13.5 5.3505 11.1495 3 8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25ZM15 8.25C15 9.84372 14.4464 11.3074 13.5227 12.4622L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L12.4622 13.5227C11.3074 14.4464 9.84372 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25Z" fill="currentColor" />
        </svg>
      </button>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full ps-2 textLabel16 outline-none rounded-full bg-transparent"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className=""
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.281 18.2194C19.3507 18.2891 19.406 18.3718 19.4437 18.4629C19.4814 18.5539 19.5008 18.6515 19.5008 18.7501C19.5008 18.8486 19.4814 18.9462 19.4437 19.0372C19.406 19.1283 19.3507 19.211 19.281 19.2807C19.2114 19.3504 19.1286 19.4056 19.0376 19.4433C18.9465 19.4811 18.849 19.5005 18.7504 19.5005C18.6519 19.5005 18.5543 19.4811 18.4632 19.4433C18.3722 19.4056 18.2895 19.3504 18.2198 19.2807L12.0004 13.0604L5.78104 19.2807C5.64031 19.4214 5.44944 19.5005 5.25042 19.5005C5.05139 19.5005 4.86052 19.4214 4.71979 19.2807C4.57906 19.1399 4.5 18.9491 4.5 18.7501C4.5 18.551 4.57906 18.3602 4.71979 18.2194L10.9401 12.0001L4.71979 5.78068C4.57906 5.63995 4.5 5.44907 4.5 5.25005C4.5 5.05103 4.57906 4.86016 4.71979 4.71943C4.86052 4.5787 5.05139 4.49963 5.25042 4.49963C5.44944 4.49963 5.64031 4.5787 5.78104 4.71943L12.0004 10.9397L18.2198 4.71943C18.3605 4.5787 18.5514 4.49963 18.7504 4.49963C18.9494 4.49963 19.1403 4.5787 19.281 4.71943C19.4218 4.86016 19.5008 5.05103 19.5008 5.25005C19.5008 5.44907 19.4218 5.63995 19.281 5.78068L13.0607 12.0001L19.281 18.2194Z" fill="currentColor" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
