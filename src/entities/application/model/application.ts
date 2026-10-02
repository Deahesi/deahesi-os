export type ApplicationState = "standby" | "opened" | "collapsed";

export type ExecuteSrc =
  | { from: "bundle"; src: string }
  | { from: "user"; html: string };

type ApplicationBase = {
  id: number;
  name: string;
  label: string;
  icon: string;
  state: ApplicationState;
  windowOrder?: number;
};

export type Application =
  | (ApplicationBase & { type: "explorer"; applications: Application[] })
  | (ApplicationBase & { type: "notebook"; content: string })
  | (ApplicationBase & { type: "execute"; src: ExecuteSrc })
  | (ApplicationBase & { type: "settings" });

export type CreatableApplicationType = Exclude<Application["type"], "settings">;
