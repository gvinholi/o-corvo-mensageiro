import type { EventFilter } from "../utils/eventGroups";

interface EventFiltersProps {
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

export function EventFilters({
  activeFilter,
  onFilterChange,
}: EventFiltersProps) {
  return (
    <div className="space-y-2">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterChange(option.value)}
            className={[
              "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition duration-200",
              isActive
                ? "border-sky-500 bg-sky-500/10 text-sky-200"
                : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
