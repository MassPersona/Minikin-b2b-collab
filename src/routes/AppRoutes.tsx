import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CampaignsPage } from '../pages/CampaignsPage';
import { CreateCampaignPage } from '../pages/CreateCampaignPage';
import { CampaignDetailsPage } from '../pages/CampaignDetailsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CampaignsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/campaigns/new"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateCampaignPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/campaigns/:campaignId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CampaignDetailsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
