const StatusButton = ({ status, label }) => {
  const variants = {
    golden: {
      border: "2px solid #37352B",
      background: "#2C2313",
      color: "#B88934",
    },
    yellow: {
      border: "2px solid #514920",
      background: "#333525",
      color: "#B59E1E",
    },
    green: {
      border: "2px solid #32564A",
      background: "#24312D",
      color: "#13B882",
    },
  };

  const style = variants[status] ?? variants.golden;

  return (
    <button
      style={{
        ...style,
      }}
      className="w-fit border-2 rounded-[8px] py-1 px-2 textLabel14"
    >
      {label}
    </button>
  );
};

export default StatusButton;