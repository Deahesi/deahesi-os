import type {
  Application,
  CreatableApplicationType,
} from "@/entities/application";

export function createApplication(
  type: CreatableApplicationType,
  id: number,
  name: string,
): Application {
  const common = { id, name, label: name, state: "standby" as const };

  switch (type) {
    case "explorer":
      return { ...common, type, icon: "/folder.svg", applications: [] };
    case "notebook":
      return { ...common, type, icon: "/document.svg", content: "" };
    case "execute":
      return {
        ...common,
        type,
        icon: "/computer.svg",
        src: { from: "user", html: "" },
      };
  }
}

