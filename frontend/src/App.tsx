import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import ParcelsPage from '@/pages/ParcelsPage';
import GisPage from '@/pages/GisPage';
import WorkflowsPage from '@/pages/WorkflowsPage';
import CompensationPage from '@/pages/CompensationPage';
import AffectedFamiliesPage from '@/pages/AffectedFamiliesPage';
import RnRPage from '@/pages/RnRPage';
import FieldOperationsPage from '@/pages/FieldOperationsPage';
import DocumentsPage from '@/pages/DocumentsPage';
import GrievancesPage from '@/pages/GrievancesPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import DecisionSupportPage from '@/pages/DecisionSupportPage';
import AuditLogPage from '@/pages/AuditLogPage';
import SettingsPage from '@/pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailsPage /> },
      { path: 'parcels', element: <ParcelsPage /> },
      { path: 'gis', element: <GisPage /> },
      { path: 'workflows', element: <WorkflowsPage /> },
      { path: 'compensation', element: <CompensationPage /> },
      { path: 'affected-families', element: <AffectedFamiliesPage /> },
      { path: 'r-and-r', element: <RnRPage /> },
      { path: 'field-operations', element: <FieldOperationsPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'grievances', element: <GrievancesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'decision-support', element: <DecisionSupportPage /> },
      { path: 'audit-log', element: <AuditLogPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
