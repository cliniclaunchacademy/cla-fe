"use client";

import DropdownSelect from "@common/DropdownSelect";
import SearchInput from "@common/FormFieldComponent/SearchInput/SearchInput";
import { useState } from "react";

export default function LabApplications() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="w-full flex flex-col gap-y-9 px-9 py-10 ">
      <div className="">
        <h3 className="text-[#EFEFEE] textDisplay40 mb-3 ">Lab Applications</h3>
        <p className="text-[#ABADAF] textBody18 ">Review and manage lab partner portal access requests</p>
      </div>
      <div className="flex gap-4 ">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, company..."
          onSubmit={() => { }}
        />

        <button>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.75927 10.292C9.80416 9.80997 10.0034 9.35298 10.3306 8.99121L15.7476 3H2.24975L7.66821 8.99121C8.04216 9.40461 8.2495 9.94255 8.24975 10.5V15.0007L9.74902 15.75H9.74975V10.5L9.75927 10.292ZM11.2498 15.75L11.2468 15.8452C11.2327 16.0677 11.1689 16.2847 11.0601 16.4802C10.9356 16.7036 10.756 16.8914 10.5386 17.0259C10.3211 17.1604 10.0726 17.237 9.81713 17.2485C9.5937 17.2586 9.37132 17.2188 9.16601 17.1321L9.07885 17.0918L7.57885 16.3418C7.32961 16.2172 7.11961 16.0259 6.97314 15.7888C6.845 15.5814 6.77019 15.3462 6.75341 15.104L6.74975 15V10.5C6.74958 10.3143 6.68024 10.1353 6.55566 9.99756L1.13647 4.00562V4.00488C0.942109 3.78953 0.814451 3.52231 0.768793 3.23584C0.723182 2.94942 0.760895 2.65567 0.878656 2.39062C0.996449 2.12559 1.18921 1.90053 1.43237 1.74243C1.67547 1.58442 1.95908 1.50014 2.24902 1.5H15.7512L15.8596 1.50439C16.1113 1.52323 16.3547 1.60535 16.5671 1.7439C16.8099 1.90224 17.002 2.12714 17.1194 2.39209C17.2368 2.65698 17.2749 2.95047 17.2292 3.23657C17.1835 3.52267 17.0556 3.78976 16.8616 4.00488L16.8608 4.00562L11.4438 9.99756H11.4431C11.3186 10.1353 11.2499 10.3143 11.2498 10.5V15.75Z" fill="#ABADAF" />
          </svg>
        </button>

        <div className="flex-1 ">
          <DropdownSelect
            filters={[
              { key: "allStatuses", label: "All Statuses" },
              { key: "status1", label: "Status 1" },
              { key: "status2", label: "Status 2" },
            ]}
            onChange={(val) => console.log(val)}
          />
        </div>

      </div>
    </section>
  );
}
