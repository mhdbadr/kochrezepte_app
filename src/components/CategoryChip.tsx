import './CategoryChip.css';

interface CategoryChipProps {
    label: string;
}

export default function CategoryChip({ label }: CategoryChipProps) {
    return (
        <button className="category-chip">
            {label}
        </button>
    );
}