type ClearFilterButtonProps = {
    onClear: () => void;
    label?: string;
};

export default function ClearFilterButton({
    onClear,
    label = '초기화',
}: ClearFilterButtonProps) {
    return (
        <button type="button" onClick={onClear} className="text-end text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
            {label}
        </button>
    );
}
