import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { TierBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { RAGDot } from '../common/RAGBadge';
import type { VentureTier, RAGStatus } from '../../types';
import { useMyVenture, useVentureStreams, useAgreement } from '../../hooks/useVentures';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; description: string }> = {
  draft: { label: 'Draft', icon: <FileText className="w-6 h-6" />, color: 'text-gray-500 bg-gray-100', description: 'Your application is saved as a draft.' },
  submitted: { label: 'Submitted', icon: <Clock className="w-6 h-6" />, color: 'text-blue-600 bg-blue-100', description: 'Your application has been submitted and is awaiting review.' },
  under_review: { label: 'Under Review', icon: <Clock className="w-6 h-6" />, color: 'text-amber-600 bg-amber-100', description: 'Your application is currently being reviewed by our team.' },
  approved: { label: 'Approved', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-600 bg-green-100', description: 'Congratulations! Your venture has been approved. Please review your agreement.' },
  rejected: { label: 'Not Selected', icon: <XCircle className="w-6 h-6" />, color: 'text-red-600 bg-red-100', description: 'Unfortunately, your venture was not selected at this time.' },
  self_serve: { label: 'Self-Serve', icon: <FileText className="w-6 h-6" />, color: 'text-gray-500 bg-gray-100', description: 'Your venture has been assigned to the self-serve track.' },
  active: { label: 'Active', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-600 bg-green-100', description: 'Your venture is active! Access your workbench to track progress.' },
  completed: { label: 'Completed', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-600 bg-green-100', description: 'Your venture has been completed. Congratulations!' },
  dropped: { label: 'Declined', icon: <XCircle className="w-6 h-6" />, color: 'text-gray-500 bg-gray-100', description: 'You declined the agreement for this venture.' },
};

export function MyVenturePage() {
  const navigate = useNavigate();
  const { data: venture, isLoading } = useMyVenture();
  const { data: streams } = useVentureStreams(venture?.id);
  const { data: agreement } = useAgreement(venture?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No venture yet - show apply prompt
  if (!venture) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Venture</h1>
          <p className="text-gray-500 mt-1">Start your growth journey with Accelerate</p>
        </div>

        <Card className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Venture Yet</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't submitted a venture application yet. Start your growth journey by defining your venture.
          </p>
          <Button size="lg" onClick={() => navigate('/apply/step-1')} icon={<ArrowRight className="w-4 h-4" />}>
            Start Application
          </Button>
        </Card>
      </div>
    );
  }

  const status = STATUS_CONFIG[venture.status] || STATUS_CONFIG.draft;
  const streamData = (streams || []).map((s) => ({
    name: s.stream_name,
    rag: (s.rag_status || 'green') as RAGStatus,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Venture</h1>
        <p className="text-gray-500 mt-1">Track your growth journey</p>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${status.color}`}>
            {status.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">{status.label}</h2>
              {venture.tier && <TierBadge tier={venture.tier as VentureTier} />}
            </div>
            <p className="text-sm text-gray-500">{status.description}</p>
          </div>
        </div>
      </Card>

      {/* Venture Details */}
      <Card className="mb-6">
        <CardTitle>Venture Details</CardTitle>
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Current Product</p>
              <p className="text-sm font-medium text-gray-900">{venture.current_product || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">New Product</p>
              <p className="text-sm font-medium text-primary-600">{venture.venture_product || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Geography</p>
              <p className="text-sm font-medium text-gray-900">{venture.current_geography || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">New Geography</p>
              <p className="text-sm font-medium text-primary-600">{venture.venture_geography || '—'}</p>
            </div>
          </div>
          {venture.venture_description && (
            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-gray-700">{venture.venture_description}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Stream Status (if active) */}
      {streamData.length > 0 && ['active', 'approved'].includes(venture.status) && (
        <Card className="mb-6">
          <CardTitle>Stream Progress</CardTitle>
          <div className="mt-3 flex items-center justify-between px-2">
            {['Capital', 'Product', 'People', 'Ops', 'GTM', 'Procure'].map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <RAGDot status={streamData[i]?.rag || 'green'} />
                <span className="text-[10px] text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons based on status */}
      <div className="space-y-3">
        {venture.status === 'approved' && agreement?.status === 'pending' && (
          <Card hover onClick={() => navigate('/my-venture/agreement')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Review Your Agreement</h3>
                  <p className="text-xs text-gray-500">Accept or decline your growth agreement</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        )}

        {venture.status === 'active' && (
          <Card hover onClick={() => navigate(`/workbench/${venture.id}`)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Open Workbench</h3>
                  <p className="text-xs text-gray-500">Track your 6 streams and deliverables</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        )}

        {['submitted', 'under_review'].includes(venture.status) && (
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Application Under Review</h3>
                <p className="text-xs text-gray-500">
                  Submitted on {new Date(venture.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </Card>
        )}

        {venture.status === 'rejected' && (
          <Button size="lg" className="w-full" onClick={() => navigate('/apply/step-1')}>
            Submit New Application
          </Button>
        )}
      </div>
    </div>
  );
}
