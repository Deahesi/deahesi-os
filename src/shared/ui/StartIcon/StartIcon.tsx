import { cn } from "cn";

type StartIconProps = {
  className?: string;
};

export function StartIcon({ className }: StartIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-5 shrink-0 grid-cols-2 grid-rows-2 gap-px border border-black bg-black p-px",
        className,
      )}
    >
      <span className="bg-[#000080]" />
      <span className="bg-[#ff0000]" />
      <span className="bg-[#008000]" />
      <span className="bg-[#ffff00]" />
    </span>
  );
}
