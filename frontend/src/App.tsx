import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { EventsPage } from "./pages/EventsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route
          path="notifications"
          element={
            <PlaceholderPage
              title="Notificações"
              description="Auditoria das mensagens enviadas para o Telegram."
            />
          }
        />
        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="Configurações"
              description="Parâmetros operacionais dos monitores e integrações."
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;