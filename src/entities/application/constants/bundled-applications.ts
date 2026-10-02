import type { Application } from "@/entities/application";

export const aboutApp: Application = {
  id: 6,
  name: "about",
  label: "About.exe",
  icon: "/computer.svg",
  state: "standby",
  type: "execute",
  src: { from: "bundle", src: "/apps/about.html" },
};

// export const stackApp: Application = {
//   id: 7,
//   name: "my-stack",
//   label: "My Stack.exe",
//   icon: "/computer.svg",
//   state: "standby",
//   type: "execute",
//   src: { from: "bundle", src: "/apps/my-stack.html" },
// };
