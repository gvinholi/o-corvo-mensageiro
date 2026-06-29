interface EventSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function EventSearch({ value, onChange }: EventSearchProps) {
  return (
    <div>
      <label
        htmlFor="event-search"
        className="text-sm font-semibold text-white"
      >
        Pesquisa
      </label>
      <p className="mt-1 text-sm text-slate-500">
        Busque por texto, cliente, produto ou número do pedido.
      </p>

      <div className="mt-3">
        <input
          id="event-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite para pesquisar..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        />
      </div>
    </div>
  );
}
