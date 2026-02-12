import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Banknote, Package, Users, Settings, TrendingUp, Building } from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { Badge, TierBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { StreamSelfStatus, VentureTier } from '../../types';
import { useMyVenture, useVentureStreams, useAgreement, useUpdateAgreement } from '../../hooks/useVentures';

const STREAM_ICONS = [Banknote, Package, Users, Settings, TrendingUp, Building];

const statusConfig: Record<StreamSelfStatus, { label: string; color: string; bg: string }> = {
  done: { label: 'Done', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  on_it: { label: 'On It', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  need_help: { label: 'Need Help', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

const SUPPORT_HOURS: Record<string, number> = {
  learn: 15,
  connect: 20,
  do: 30,
};

const STREAM_CHECKPOINTS: Record<string, string[]> = {
  'Capital & Funding': [
    'Complete financial projections for the venture',
    'Identify relevant financing schemes and programs',
    'Prepare loan/investment application with business plan',
    'Secure working capital facility',
    'Set up financial management and controls',
  ],
  'Product / Service': [
    'Market research on target segment preferences',
    'Develop product/service prototypes or MVPs',
    'Obtain required certifications and compliance',
    'Conduct product testing with target customers',
    'Finalize product line with pricing strategy',
  ],
  'People & Talent': [
    'Define team structure and key roles',
    'Hire critical leadership/management positions',
    'Train existing staff on new requirements',
    'Onboard specialized talent where needed',
    'Establish performance metrics and processes',
  ],
  'Operations & Supply Chain': [
    'Identify key operational partners and vendors',
    'Set up logistics and distribution processes',
    'Establish quality control standards',
    'Configure warehousing and fulfillment',
    'Test end-to-end operations with pilot run',
  ],
  'Go-to-Market (GTM)': [
    'Map target market ecosystem and channels',
    'Develop market-specific marketing materials',
    'Secure distribution partners or sales channels',
    'Launch targeted marketing campaign',
    'Close first set of paying customers',
  ],
  'Procurement & Infrastructure': [
    'Audit current capacity and infrastructure needs',
    'Procure additional equipment and resources',
    'Set up dedicated production/service facility',
    'Implement operational management systems',
    'Obtain all required licenses and registrations',
  ],
};

export function AgreementScreen() {
  const navigate = useNavigate();
  const { data: venture, isLoading: ventureLoading } = useMyVenture();
  const { data: streams } = useVentureStreams(venture?.id);
  const { data: agreement } = useAgreement(venture?.id);
  const updateAgreement = useUpdateAgreement();
  const [showDecline, setShowDecline] = useState(false);

  if (ventureLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!venture || !['approved', 'active'].includes(venture.status)) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Agreement Available</h1>
        <p className="text-gray-500">Your venture needs to be approved before you can view the agreement.</p>
        <Button className="mt-4" onClick={() => navigate('/my-venture')}>Go to Dashboard</Button>
      </div>
    );
  }

  if (agreement?.status === 'accepted') {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agreement Accepted!</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Welcome to Accelerate! Your venture partner will reach out to schedule your first meeting.
          </p>
          <Button className="mt-6" onClick={() => navigate(`/workbench/${venture.id}`)}>
            Go to Venture Workbench
          </Button>
        </Card>
      </div>
    );
  }

  async function handleAccept() {
    if (!agreement) return;
    try {
      await updateAgreement.mutateAsync({
        id: agreement.id,
        status: 'accepted',
        venture_id: venture!.id,
      });
    } catch (err) {
      console.error('Failed to accept agreement:', err);
    }
  }

  async function handleDecline() {
    if (!agreement) return;
    try {
      await updateAgreement.mutateAsync({
        id: agreement.id,
        status: 'declined',
        venture_id: venture!.id,
      });
      setShowDecline(false);
      navigate('/my-venture');
    } catch (err) {
      console.error('Failed to decline agreement:', err);
    }
  }

  // Build stream data from DB streams or defaults
  const streamData = (streams || []).map((s, index) => {
    const selfStatus = (s.self_status || 'on_it') as StreamSelfStatus;
    const hours = s.self_status === 'need_help' ? (SUPPORT_HOURS[s.support_type || 'learn'] || 15) : 0;
    const checkpoints = STREAM_CHECKPOINTS[s.stream_name] || [1, 2, 3, 4, 5].map((i) => `Checkpoint ${i}`);

    return {
      name: s.stream_name,
      end_deliverable: s.end_deliverable || `End deliverable for ${s.stream_name}`,
      self_status: selfStatus,
      support_type: s.support_type,
      hours,
      checkpoints,
      icon_index: index,
    };
  });

  const totalHours = agreement?.total_support_hours || streamData.reduce((sum, s) => sum + s.hours, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Your Growth Agreement</h1>
          {venture.tier && <TierBadge tier={venture.tier as VentureTier} />}
        </div>
        <p className="text-gray-500">{venture.venture_description || venture.venture_product}</p>
      </div>

      {/* Assigned Team */}
      <Card className="mb-6">
        <CardTitle>Your Assigned Team</CardTitle>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {venture.venture_partner && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                {venture.venture_partner.full_name?.charAt(0) || 'V'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{venture.venture_partner.full_name}</p>
                <p className="text-xs text-gray-500">{venture.venture_partner.designation || 'Venture Partner'}</p>
              </div>
            </div>
          )}
          {venture.success_manager && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                {venture.success_manager.full_name?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{venture.success_manager.full_name}</p>
                <p className="text-xs text-gray-500">{venture.success_manager.designation || 'Success Manager'}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Support Hours */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Total Support Hours</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Across all streams where you need help</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary-600">{totalHours}</p>
            <p className="text-xs text-gray-500">hours included</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            If support hours are exceeded, you will fund additional engagement at the prevailing rates.
          </p>
        </div>
      </Card>

      {/* Six Stream Plan */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Execution Plan — 6 Streams x 5 Checkpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {streamData.map((stream) => {
            const Icon = STREAM_ICONS[stream.icon_index] || Banknote;
            const config = statusConfig[stream.self_status];

            return (
              <Card key={stream.name} padding="sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{stream.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{stream.end_deliverable}</p>
                  </div>
                </div>

                {stream.support_type && stream.hours > 0 && (
                  <div className="mb-3 px-3 py-2 bg-primary-50 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-medium text-primary-700 capitalize">
                      Support: {stream.support_type}
                    </span>
                    <Badge variant="primary">{stream.hours} hrs</Badge>
                  </div>
                )}

                <div className="space-y-1.5">
                  {stream.checkpoints.map((cp, i) => (
                    <div key={i} className="flex items-start gap-2 py-1">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-gray-600">{cp}</p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Accept / Decline */}
      {agreement && agreement.status === 'pending' && (
        <Card className="mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to commit?</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto">
              By accepting, you commit to executing these deliverables across 6 streams.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="danger"
                size="lg"
                onClick={() => setShowDecline(true)}
                icon={<X className="w-4 h-4" />}
              >
                Decline
              </Button>
              <Button
                size="lg"
                onClick={handleAccept}
                loading={updateAgreement.isPending}
                icon={<Check className="w-4 h-4" />}
              >
                Accept Agreement
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Modal isOpen={showDecline} onClose={() => setShowDecline(false)} title="Decline Agreement?" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to decline? You can always reapply later when you're ready.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDecline(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDecline} loading={updateAgreement.isPending}>Yes, Decline</Button>
        </div>
      </Modal>
    </div>
  );
}
