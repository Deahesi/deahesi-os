import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import type { Application } from "@/entities/application";
import { useApplicationStore } from "@/entities/application/store/ApplicationStoreProvider";

type NotebookProps = {
  application: Extract<Application, { type: "notebook" }>;
};

export function Notebook({ application }: NotebookProps) {
  const updateContent = useApplicationStore((store) => store.updateContent);
  const t = useTranslations("ui");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(application.id, event.currentTarget.value);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1 p-1">
      <p className="px-2 py-1">{t("notebook")}</p>
      <textarea
        aria-label={application.label}
        value={application.content}
        onChange={handleChange}
        spellCheck
        className="min-h-0 flex-1 resize-none border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white p-3 text-lg outline-none"
        placeholder={t("documentPlaceholder")}
      />
      <footer className="flex flex-wrap justify-between gap-2 px-2 py-1 text-sm">
        <span>{t("autosave")}</span>
        <span>
          {application.content.length} {t("characters")}
        </span>
      </footer>
    </div>
  );
}
