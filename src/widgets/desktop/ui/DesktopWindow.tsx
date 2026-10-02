import { useTranslations } from "next-intl";
import type { Application } from "@/entities/application";
import { useApplicationStore } from "@/features/applications";
import { ApplicationLayout } from "@/shared/ui/ApplicationLayout/ApplicationLayout";
import { ApplicationContent } from "../../../features/applications/ui/ApplicationProvider/ApplicationProvider";

type DesktopWindowProps = {
  application: Application;
  active: boolean;
  order: number;
};

export function DesktopWindow({
  application,
  active,
  order,
}: DesktopWindowProps) {
  const openApplication = useApplicationStore((store) => store.openApplication);
  const closeApplication = useApplicationStore(
    (store) => store.closeApplication,
  );
  const collapseApplication = useApplicationStore(
    (store) => store.collapseApplication,
  );
  const t = useTranslations("ui");

  const title =
    application.type === "settings"
      ? t("settings")
      : application.type === "execute"
        ? `${application.name} — ${t("frontendWindowSuffix")}`
        : application.label;

  const handleFocus = () => {
    if (!active) openApplication(application.id);
  };

  return (
    <ApplicationLayout
      name={title}
      active={active}
      collapsed={application.state === "collapsed"}
      large={application.type === "execute"}
      order={order}
      onFocus={handleFocus}
      onClose={() => closeApplication(application.id)}
      onCollapse={() => collapseApplication(application.id)}
    >
      <ApplicationContent application={application} />
    </ApplicationLayout>
  );
}
