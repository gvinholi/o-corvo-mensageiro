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
    <div className="animate-fade-in-up rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-xl shadow-slate-950/20">
      <div className="flex gap-2 overflow-x-auto">
      {filterOptions.map((option) => {
        const isActive = option.value === activeFilter;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterChange(option.value)}
            className={[
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition duration-200",
              isActive
                ? "bg-sky-500 text-white shadow-lg shadow-sky-950/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
      </div>
    </div>
  );
}
