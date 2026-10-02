import { useState, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import type { Application } from "@/entities/application";
import { useApplicationStore } from "@/entities/application/store/ApplicationStoreProvider";
import { cn } from "cn";

type ExecutableProps = {
  application: Extract<Application, { type: "execute" }>;
};

export function Executable({ application }: ExecutableProps) {
  const [editing, setEditing] = useState(false);
  const updateContent = useApplicationStore((store) => store.updateContent);
  const t = useTranslations("ui");

  const source = application.src;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(application.id, event.currentTarget.value);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {source.from === "user" && (
        <div className="flex gap-1 border-b border-[#808080] p-1">
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-pressed={!editing}
            className="border border-white px-2 aria-pressed:bg-white"
          >
            {t("preview")}
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-pressed={editing}
            className="border border-white px-2 aria-pressed:bg-white"
          >
            {t("sourceCode")}
          </button>
        </div>
      )}
      {source.from === "user" && editing ? (
        <textarea
          aria-label={application.label}
          value={source.html}
          onChange={handleChange}
          spellCheck={false}
          className="min-h-0 flex-1 resize-none bg-white p-3 font-mono text-sm text-black outline-none"
        />
      ) : (
        <iframe
          title={application.label}
          src={source.from === "bundle" ? source.src : undefined}
          srcDoc={source.from === "user" ? source.html : undefined}
          sandbox={cn(
            "allow-scripts",
            source.from === "bundle" && "allow-popups",
          )}
          referrerPolicy="no-referrer"
          className="min-h-0 w-full flex-1 border-0"
        />
      )}
    </div>
  );
}
