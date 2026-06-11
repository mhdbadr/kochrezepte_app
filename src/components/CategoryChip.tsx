import './CategoryChip.css';

interface CategoryChipProps {
    label: string;
    onClick?: () => void;
}

export default function CategoryChip({ label, onClick }: CategoryChipProps) {
    return (
        <button className="category-chip" onClick={onClick}>
            {label}
        </button>
    );
}