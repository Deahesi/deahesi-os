import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { Button } from "@/shared/ui/Button/Button";
import { useTranslations } from "next-intl";
import type { CreatableApplicationType } from "@/entities/application";
import { useApplicationStore } from "@/entities/application/store/ApplicationStoreProvider";

type CreateApplicationProps = {
  type: CreatableApplicationType;
  parentId?: number;
  onClose: () => void;
};

export const CreateApplication = ({
  type,
  parentId,
  onClose,
}: CreateApplicationProps) => {
  const t = useTranslations("ui");
  const dialog = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState<string>(t(`new-${type}`));
  const [error, setError] = useState("");
  const createApplication = useApplicationStore(
    (store) => store.createApplication,
  );

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = createApplication(type, name, parentId);
    if (id === null) {
      setError(t("duplicateName"));
      return;
    }

    onClose();
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
    setError("");
  };

  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      className="m-auto w-96 max-w-[calc(100%-2rem)] border-2 border-t-white border-l-white border-r-black border-b-black bg-background-window p-1 text-black backdrop:bg-black/20"
    >
      <h2 className="bg-secondary px-2 py-1 text-lg text-white">
        {t("create")}
      </h2>
      <form className="space-y-4 p-4" onSubmit={handleSubmit}>
        <label className="block">
          {t("name")}
          <input
            autoFocus
            required
            maxLength={120}
            value={name}
            onFocus={handleFocus}
            onChange={handleChange}
            className="mt-1 w-full border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white px-2 py-1"
          />
        </label>
        {error && (
          <p role="alert" className="text-red-800">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="submit" className="text-base">
            {t("create")}
          </Button>
          <Button className="text-base" onClick={onClose}>
            {t("cancel")}
          </Button>
        </div>
      </form>
    </dialog>
  );
};
