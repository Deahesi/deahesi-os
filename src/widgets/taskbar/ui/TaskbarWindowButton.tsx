import Image from "next/image";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import type { Application } from "@/entities/application";
import { useApplicationStore } from "@/features/applications";
import { Button } from "@/shared/ui/Button/Button";

type TaskbarWindowButtonProps = {
  application: Application;
  active: boolean;
};

export const TaskbarWindowButton = ({
  application,
  active,
}: TaskbarWindowButtonProps) => {
  const openApplication = useApplicationStore((store) => store.openApplication);
  const collapseApplication = useApplicationStore(
    (store) => store.collapseApplication,
  );
  const t = useTranslations("ui");
  const label =
    application.type === "settings" ? t("settings") : application.label;

  const handleClick = () => {
    if (active) collapseApplication(application.id);
    else openApplication(application.id);
  };

  return (
    <Button
      title={label}
      aria-pressed={active}
      className={cn(
        "min-h-9 max-w-48 shrink-0 px-2 text-base font-normal",
        active &&
          "border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#ddd]",
      )}
      icon={<Image src={application.icon} alt="" width={20} height={20} />}
      onClick={handleClick}
    >
      <span className="max-w-28 truncate">{label}</span>
    </Button>
  );
};




