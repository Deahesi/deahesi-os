import type { Application } from "../model/application";

export const getApplications = (applications: Application[]): Application[] =>
  applications.flatMap((application) => [
    application,
    ...(application.type === "explorer"
      ? getApplications(application.applications)
      : []),
  ]);

export const findApplication = (applications: Application[], id: number) =>
  getApplications(applications).find((application) => application.id === id);

export const getOpenApplications = (applications: Application[]) =>
  getApplications(applications)
    .filter((application) => application.state !== "standby")
    .sort((a, b) => (a.windowOrder ?? 0) - (b.windowOrder ?? 0));
