import { cn } from "cn";
import type { ComponentPropsWithRef, ReactNode } from "react";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  icon?: ReactNode;
};

export function Button({
  children,
  className,
  icon,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "group inline-flex min-h-10 items-center justify-center border-2 border-solid",
        "border-t-white border-l-white border-r-[#404040] border-b-[#404040]",
        "bg-[#c0c0c0] px-2.5 py-1 text-[22px] leading-none font-bold text-black select-none",
        "shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#dfdfdf]",
        "active:border-t-[#404040] active:border-l-[#404040] active:border-r-white active:border-b-white",
        "active:shadow-[inset_1px_1px_0_#808080]",
        "focus-visible:outline-1 focus-visible:outline-dotted focus-visible:outline-black focus-visible:outline-offset-[-6px]",
        "disabled:cursor-not-allowed disabled:text-[#808080] disabled:active:border-t-white disabled:active:border-l-white disabled:active:border-r-[#404040] disabled:active:border-b-[#404040]",
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-1.5 group-active:translate-x-px group-active:translate-y-px">
        {icon}
        {children}
      </span>
    </button>
  );
}
