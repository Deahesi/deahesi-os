import { contacts } from "@/constants/contacts";
import { CreatableApplicationType } from "@/entities/application";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

type StartMenuProps = {
  open: boolean;
  onCreate: (type: CreatableApplicationType) => void;
  onSettingsOpen: () => void;
};

export const StartMenu = ({
  open,
  onCreate,
  onSettingsOpen,
}: StartMenuProps) => {
  const t = useTranslations("ui");

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="start-menu"
          aria-label={t("start")}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.16 }}
          style={{ transformOrigin: "bottom left", zIndex: 2000 }}
          className="absolute bottom-full left-1 flex max-h-[calc(100dvh-52px)] w-84 max-w-[calc(100vw-8px)] overflow-auto border-2 border-t-white border-l-white border-r-black border-b-black bg-background-window p-1 shadow-lg"
        >
          <div
            aria-hidden="true"
            className="flex w-12 shrink-0 items-end justify-center bg-secondary py-5 text-xl tracking-[.3em] text-white [writing-mode:vertical-rl] rotate-180"
          >
            DEAHESI OS
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="px-5 py-4 text-sm text-[#666]">{t("contacts")}</h2>
            {contacts.map((contact) => {
              const content = (
                <>
                  <span className="flex size-8 shrink-0 items-center justify-center border border-t-white border-l-white border-r-[#808080] border-b-[#808080] text-base">
                    {contact.icon}
                  </span>
                  {contact.label}
                </>
              );
              return contact.href ? (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 px-4 py-3 text-xl hover:bg-secondary hover:text-white"
                >
                  {content}
                </a>
              ) : (
                <button
                  key={contact.label}
                  disabled
                  title={t("contactMissing")}
                  className="flex w-full items-center gap-4 px-4 py-3 text-xl text-[#808080]"
                >
                  {content}
                </button>
              );
            })}
            <div className="mx-3 my-2 border-t border-[#808080]" />
            <button
              className="block w-full px-5 py-2 text-left hover:bg-secondary hover:text-white"
              onClick={() => onCreate("explorer")}
            >
              {t("createFolder")}
            </button>
            <button
              className="block w-full px-5 py-2 text-left hover:bg-secondary hover:text-white"
              onClick={() => onCreate("notebook")}
            >
              {t("createDocument")}
            </button>
            <button
              className="block w-full px-5 py-2 text-left hover:bg-secondary hover:text-white"
              onClick={() => onCreate("execute")}
            >
              {t("createApplication")}
            </button>
            <div className="mx-3 my-2 border-t border-[#808080]" />
            <button
              className="block w-full px-5 py-2 text-left hover:bg-secondary hover:text-white"
              onClick={onSettingsOpen}
            >
              ⚙ {t("settings")}
            </button>
            <p className="px-5 py-3 text-sm text-[#666]">{t("menuHint")}</p>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
