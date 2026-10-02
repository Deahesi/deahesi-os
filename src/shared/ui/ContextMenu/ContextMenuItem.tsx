import type { ContextMenuAction } from "./ContextMenu";

type ContextMenuItemProps = {
  action: ContextMenuAction;
  autoFocus: boolean;
  onClose: () => void;
};

export function ContextMenuItem({ action, autoFocus, onClose }: ContextMenuItemProps) {
  const handleSelect = () => {
    action.onSelect();
    onClose();
  };

  return (
    <button
      type="button"
      role="menuitem"
      autoFocus={autoFocus}
      disabled={action.disabled}
      className="block w-full px-3 py-2 text-left text-base text-black hover:bg-secondary hover:text-white focus:bg-secondary focus:text-white disabled:text-[#808080]"
      onClick={handleSelect}
    >
      {action.label}
    </button>
  );
}
