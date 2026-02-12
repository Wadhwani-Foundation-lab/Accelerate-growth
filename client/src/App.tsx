import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Auth
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';

// Application Flow
import { VentureDefinition } from './components/application/VentureDefinition';
import { CommitmentAssessment } from './components/application/CommitmentAssessment';
import { SupportNeeds } from './components/application/SupportNeeds';

// Selection & Review
import { ApplicationsQueue } from './components/selection/ApplicationsQueue';
import { ApplicationReview } from './components/selection/ApplicationReview';

// Agreement
import { AgreementScreen } from './components/agreement/AgreementScreen';

// Workbench
import { VentureWorkbench } from './components/workbench/VentureWorkbench';

// Selection
import { ApprovalWorkflow } from './components/selection/ApprovalWorkflow';

// Dashboards
import { CSMDashboard } from './components/dashboard/CSMDashboard';
import { VPDashboard } from './components/dashboard/VPDashboard';
import { MentorDashboard } from './components/dashboard/MentorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { FieldHeadDashboard } from './components/dashboard/FieldHeadDashboard';
import { MyVenturePage } from './components/dashboard/MyVenturePage';

import type { ReactNode } from 'react';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RoleRedirect() {
  const { profile, loading } = useAuth();

  if (loading) return null;

  switch (profile?.role) {
    case 'entrepreneur':
      return <Navigate to="/my-venture" replace />;
    case 'venture_partner':
      return <Navigate to="/vp/dashboard" replace />;
    case 'mentor':
      return <Navigate to="/mentor/dashboard" replace />;
    case 'success_manager':
      return <Navigate to="/csm/dashboard" replace />;
    case 'field_head':
      return <Navigate to="/field/dashboard" replace />;
    case 'selection_manager':
      return <Navigate to="/selection/dashboard" replace />;
    case 'selection_committee':
      return <Navigate to="/committee/dashboard" replace />;
    case 'super_admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Role-based redirect */}
      <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

      {/* Entrepreneur: Application Flow (no sidebar layout) */}
      <Route path="/apply/step-1" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 lg:p-8">
            <VentureDefinition />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/apply/step-2" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 lg:p-8">
            <CommitmentAssessment />
          </div>
        </ProtectedRoute>
      } />
      <Route path="/apply/step-3" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 lg:p-8">
            <SupportNeeds />
          </div>
        </ProtectedRoute>
      } />

      {/* Entrepreneur: My Venture & Agreement (with layout) */}
      <Route path="/my-venture" element={
        <ProtectedRoute>
          <AppLayout>
            <MyVenturePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-venture/welcome" element={
        <ProtectedRoute>
          <AppLayout>
            <MyVenturePage />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/my-venture/agreement" element={
        <ProtectedRoute>
          <AppLayout>
            <AgreementScreen />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/apply" element={
        <ProtectedRoute>
          <Navigate to="/apply/step-1" replace />
        </ProtectedRoute>
      } />

      {/* Workbench (shared across roles) */}
      <Route path="/workbench/:ventureId" element={
        <ProtectedRoute>
          <AppLayout>
            <VentureWorkbench />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* CSM Routes */}
      <Route path="/csm/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <CSMDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/csm/applications" element={
        <ProtectedRoute>
          <AppLayout>
            <ApplicationsQueue />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/csm/approvals" element={
        <ProtectedRoute>
          <AppLayout>
            <ApplicationsQueue />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Approval Workflow */}
      <Route path="/approvals/:ventureId" element={
        <ProtectedRoute>
          <AppLayout>
            <ApprovalWorkflow />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Application Review */}
      <Route path="/review/:ventureId" element={
        <ProtectedRoute>
          <AppLayout>
            <ApplicationReview />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* VP Routes */}
      <Route path="/vp/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <VPDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/vp/ventures" element={
        <ProtectedRoute>
          <AppLayout>
            <VPDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Mentor Routes */}
      <Route path="/mentor/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <MentorDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/mentor/requests" element={
        <ProtectedRoute>
          <AppLayout>
            <MentorDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Field Head Routes */}
      <Route path="/field/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <FieldHeadDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/field/approvals" element={
        <ProtectedRoute>
          <AppLayout>
            <FieldHeadDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Selection Manager Routes */}
      <Route path="/selection/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <ApplicationsQueue />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/selection/applications" element={
        <ProtectedRoute>
          <AppLayout>
            <ApplicationsQueue />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Selection Committee Routes */}
      <Route path="/committee/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <ApplicationsQueue />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/committee/interviews" element={
        <ProtectedRoute>
          <AppLayout>
            <ApplicationsQueue />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/ventures" element={
        <ProtectedRoute>
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
