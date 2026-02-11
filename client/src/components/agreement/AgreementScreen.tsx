import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Clock, Banknote, Package, Users, Settings, TrendingUp, Building } from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { Badge, TierBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { StreamSelfStatus } from '../../types';

const STREAM_ICONS = [Banknote, Package, Users, Settings, TrendingUp, Building];

// Mock agreement data
const MOCK_AGREEMENT = {
  tier: 'core' as const,
  venture_name: 'Germany Export - Cricket Equipment',
  total_support_hours: 50,
  venture_partner: { name: 'Arun Goel', designation: 'Senior Venture Partner' },
  success_manager: { name: 'Niju Prabha', designation: 'Customer Success Manager' },
  first_meeting: '2026-02-18',
  streams: [
    {
      name: 'Capital & Funding',
      end_deliverable: 'Secured export financing and working capital for Germany operations',
      self_status: 'on_it' as StreamSelfStatus,
      support_type: null,
      hours: 0,
      checkpoints: [
        'Complete financial projections for Germany operations',
        'Identify export financing schemes (EXIM Bank, ECGC)',
        'Prepare loan application with business plan',
        'Secure working capital facility',
        'Set up foreign currency accounts and hedging',
      ],
    },
    {
      name: 'Product / Service',
      end_deliverable: 'DIN-certified cricket equipment ready for German market',
      self_status: 'done' as StreamSelfStatus,
      support_type: null,
      hours: 0,
      checkpoints: [
        'Market research on German cricket equipment preferences',
        'Develop product prototypes meeting DIN standards',
        'Obtain DIN/CE certifications',
        'Conduct product testing with German cricket clubs',
        'Finalize product line with pricing',
      ],
    },
    {
      name: 'People & Talent',
      end_deliverable: 'Export team assembled and operational',
      self_status: 'on_it' as StreamSelfStatus,
      support_type: null,
      hours: 0,
      checkpoints: [
        'Define export team structure and roles',
        'Hire export manager with European experience',
        'Train production staff on quality standards',
        'Onboard German-speaking customer support',
        'Establish performance metrics for export team',
      ],
    },
    {
      name: 'Operations & Supply Chain',
      end_deliverable: 'End-to-end export supply chain operational',
      self_status: 'need_help' as StreamSelfStatus,
      support_type: 'connect',
      hours: 20,
      checkpoints: [
        'Identify shipping and logistics partners for EU',
        'Set up customs and export documentation process',
        'Establish quality control for export standards',
        'Configure warehousing in Germany (or 3PL)',
        'Test end-to-end supply chain with pilot shipment',
      ],
    },
    {
      name: 'Go-to-Market (GTM)',
      end_deliverable: 'Active sales pipeline with German cricket clubs and retailers',
      self_status: 'need_help' as StreamSelfStatus,
      support_type: 'learn',
      hours: 25,
      checkpoints: [
        'Map German cricket ecosystem (clubs, leagues, retailers)',
        'Develop Germany-specific marketing materials',
        'Secure distribution partner or agent in Germany',
        'Launch targeted marketing campaign',
        'Close first 5 B2B accounts',
      ],
    },
    {
      name: 'Procurement & Infrastructure',
      end_deliverable: 'Production capacity and infrastructure scaled for export',
      self_status: 'done' as StreamSelfStatus,
      support_type: null,
      hours: 0,
      checkpoints: [
        'Audit current production capacity',
        'Procure additional equipment for cricket line',
        'Set up dedicated export packaging facility',
        'Implement ERP for export order management',
        'Obtain export licenses and registrations',
      ],
    },
  ],
};

const statusConfig: Record<StreamSelfStatus, { label: string; color: string; bg: string }> = {
  done: { label: 'Done', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  on_it: { label: 'On It', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  need_help: { label: 'Need Help', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

export function AgreementScreen() {
  const navigate = useNavigate();
  const [showDecline, setShowDecline] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const agreement = MOCK_AGREEMENT;

  function handleAccept() {
    setAccepted(true);
  }

  function handleDecline() {
    setShowDecline(false);
    navigate('/my-venture');
  }

  if (accepted) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agreement Accepted!</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Welcome to Accelerate! Your venture partner {agreement.venture_partner.name} will reach out to schedule your first meeting.
          </p>
          <Button className="mt-6" onClick={() => navigate('/workbench/1')}>
            Go to Venture Workbench
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Your Growth Agreement</h1>
          <TierBadge tier={agreement.tier} />
        </div>
        <p className="text-gray-500">{agreement.venture_name}</p>
      </div>

      {/* Assigned Team */}
      <Card className="mb-6">
        <CardTitle>Your Assigned Team</CardTitle>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
              {agreement.venture_partner.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{agreement.venture_partner.name}</p>
              <p className="text-xs text-gray-500">{agreement.venture_partner.designation}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
              {agreement.success_manager.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{agreement.success_manager.name}</p>
              <p className="text-xs text-gray-500">{agreement.success_manager.designation}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          First meeting: {new Date(agreement.first_meeting).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
            <p className="text-3xl font-bold text-primary-600">{agreement.total_support_hours}</p>
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
          {agreement.streams.map((stream, index) => {
            const Icon = STREAM_ICONS[index];
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

                {/* Support info */}
                {stream.support_type && stream.hours > 0 && (
                  <div className="mb-3 px-3 py-2 bg-primary-50 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-medium text-primary-700 capitalize">
                      Support: {stream.support_type}
                    </span>
                    <Badge variant="primary">{stream.hours} hrs</Badge>
                  </div>
                )}

                {/* 5 Checkpoints */}
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
      <Card className="mb-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to commit?</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto">
            By accepting, you commit to executing these 30 deliverables across 6 streams. If the support hours are exceeded, you will fund additional engagement.
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
              icon={<Check className="w-4 h-4" />}
            >
              Accept Agreement
            </Button>
          </div>
        </div>
      </Card>

      {/* Decline Modal */}
      <Modal isOpen={showDecline} onClose={() => setShowDecline(false)} title="Decline Agreement?" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to decline? You can always reapply later when you're ready.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDecline(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDecline}>Yes, Decline</Button>
        </div>
      </Modal>
    </div>
  );
}
