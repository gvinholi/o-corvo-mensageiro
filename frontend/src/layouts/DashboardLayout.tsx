import { NavLink, Outlet } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/" },
  { label: "Eventos", path: "/events" },
  { label: "Notificações", path: "/notifications" },
  { label: "Configurações", path: "/settings" },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-x-0 top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-5 lg:h-auto lg:flex-col lg:items-start lg:gap-8 lg:px-6 lg:py-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">
              Love Eletro
            </p>
            <h1 className="mt-1 text-lg font-bold text-white">
              O Corvo Mensageiro
            </h1>
          </div>

          <nav className="hidden w-full space-y-2 lg:block">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "block rounded-xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-sky-500 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-sky-500 text-white"
                    : "bg-slate-900 text-slate-300",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="pt-32 lg:pl-72 lg:pt-0">
        <header className="border-b border-slate-800 bg-slate-950/80 px-5 py-5 backdrop-blur lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Dashboard administrativo</p>
              <h2 className="text-2xl font-semibold text-white">
                Monitoramento operacional
              </h2>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              Sistema em implantação
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
