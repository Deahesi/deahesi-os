import type { Application } from "@/entities/application";
import { Explorer } from "../applications/Explorer/Explorer";
import { Executable } from "../applications/Executable/Executable";
import { Notebook } from "../applications/Notebook/Notebook";
import { Settings } from "../applications/Settings/Settings";

type ApplicationContentProps = {
  application: Application;
};

export function ApplicationContent({ application }: ApplicationContentProps) {
  switch (application.type) {
    case "explorer":
      return <Explorer application={application} />;
    case "notebook":
      return <Notebook application={application} />;
    case "execute":
      return <Executable application={application} />;
    case "settings":
      return <Settings />;
  }
}
