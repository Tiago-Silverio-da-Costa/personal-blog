import { PiCheckCircleBold, PiWarningCircleBold } from "react-icons/pi";

export default function Alert({
  type,
  children
}: {
  type: "success" | "error" | "warning";
  children: React.ReactNode
}) {

  return (
    <div
      className={`select-none text-sm font-normal mt-4 text-white ${type == "success"
        ? "bg-[#2DA44A]"
        : type == "error"
          ? "bg-[#E32C2C]"
          : "bg-yellow-500"
        } w-full p-3 flex gap-2 items-center text-start ${type == "warning" ? "text-zinc-900" : ""
        }`}
    >
      <span className="text-base text-white">
        {type == "success" ? <PiCheckCircleBold /> : <PiWarningCircleBold />}
      </span>
      <p>{children}</p>
    </div>
  )
}