import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

export const BootScreen = () => {
  const t = useTranslations("ui");
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.35 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#000080] px-6 text-white"
    >
      <div className="w-full max-w-xl border-2 border-t-white border-l-white border-r-black border-b-black bg-[#c0c0c0] p-1 text-black shadow-xl">
        <div className="flex items-center gap-3 bg-[#000080] px-4 py-3 text-white">
          <motion.span
            aria-hidden="true"
            animate={reducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="grid size-7 grid-cols-2 grid-rows-2 gap-px border border-black bg-black p-px"
          >
            <span className="bg-[#000080]" />
            <span className="bg-[#ff0000]" />
            <span className="bg-[#008000]" />
            <span className="bg-[#ffff00]" />
          </motion.span>
          <span className="text-2xl">{t("bootTitle")}</span>
        </div>
        <div className="space-y-5 px-6 py-7">
          <h1 className="text-2xl">{t("bootSubtitle")}</h1>
          <p className="text-lg text-[#404040]">{t("bootStatus")}</p>
          <div className="h-7 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white p-1">
            <motion.div
              aria-hidden="true"
              className="h-full bg-[#000080]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reducedMotion ? 0 : 1.35, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
