import type { EventFilter } from "../utils/eventGroups";

interface FilterBarProps {
  activeFilter: EventFilter;
  onFilterChange: (filter: EventFilter) => void;
}

const filterOptions: Array<{
  label: string;
  value: EventFilter;
}> = [
  { label: "Todos", value: "all" },
  { label: "Perguntas", value: "questions" },
  { label: "Pedidos", value: "orders" },
  { label: "Mensagens", value: "messages" },
  { label: "Reclamações", value: "claims" },
  { label: "Cancelamentos", value: "cancellations" },
];

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 p-2">
      {filterOptions.map((option) => {
        const isActive = option.value === activeFilter;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterChange(option.value)}
            className={[
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-sky-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
