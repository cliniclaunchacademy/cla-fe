const colorVariants = {
    green: { text: "text-[#62C88A]", bg: "bg-[#32564A]" },
    yellow: { text: "text-[#B59E1E]", bg: "bg-[#514920]" },
    red: { text: "text-[#D74A40]", bg: "bg-[#49332D]" },
    golden: { text: "text-[#B88934]", bg: "bg-[#37352B]" },
    orange: { text: "text-[#CC8442]", bg: "bg-[#50392A]" },
    blue: { text: "text-[#437EDA]", bg: "bg-[#1A2C46]" },
};

const RoundStatus = ({ color = "green", label }) => {
    const { text, bg } = colorVariants[color] ?? colorVariants.green;

    return (
        <button className={`px-2 p-0.5 rounded-[14px] textLabel14 ${text} ${bg}`}>
            {label}
        </button>
    );
};

export default RoundStatus;