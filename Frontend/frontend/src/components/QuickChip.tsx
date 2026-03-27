interface QuickChipProps {
  label: string;
  onClick: () => void;
}

const QuickChip = ({ label, onClick }: QuickChipProps) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-full hover:bg-accent-soft cursor-pointer transition-all duration-200"
  >
    {label}
  </button>
);

export default QuickChip;
