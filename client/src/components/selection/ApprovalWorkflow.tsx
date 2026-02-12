import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, AlertCircle, User } from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { Badge, TierBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Textarea } from '../common/Input';
import type { VentureTier } from '../../types';
import { useVenture, useApprovalChain, useApproveVenture } from '../../hooks/useVentures';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_LABELS: Record<string, string> = {
  success_manager: 'Customer Success Manager',
  field_head: 'Field Head',
  selection_manager: 'Central Selection Manager',
  selection_committee: 'Selection Committee',
};

const TIER_APPROVAL_STEPS: Record<string, string[]> = {
  prime: ['CSM Review', 'Field Head Approval'],
  core: ['CSM Review', 'Field Head Approval', 'Selection Manager'],
  select: ['CSM Review', 'Field Head Approval', 'Selection Manager', 'Committee Review'],
};

export function ApprovalWorkflow() {
  const { ventureId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: venture, isLoading: ventureLoading } = useVenture(ventureId);
  const { data: chain, isLoading: chainLoading } = useApprovalChain(ventureId);
  const approve = useApproveVenture();
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (ventureLoading || chainLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!venture) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Venture Not Found</h1>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const currentUserApproval = chain?.find(
    (c) => c.approver_id === profile?.id && c.status === 'pending'
  );

  // Check if previous approvals in chain are done
  const canApprove = currentUserApproval && chain?.every(
    (c) => c.sequence_number >= currentUserApproval.sequence_number || c.status === 'approved'
  );

  async function handleDecision(status: 'approved' | 'rejected') {
    if (!currentUserApproval || !ventureId) return;
    setSubmitting(true);
    try {
      await approve.mutateAsync({
        venture_id: ventureId,
        approval_id: currentUserApproval.id,
        status,
        notes: notes || undefined,
      });
      setNotes('');
    } catch (err) {
      console.error('Failed to submit decision:', err);
      alert('Failed to submit decision. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const tier = venture.tier as VentureTier | undefined;
  const steps = tier ? TIER_APPROVAL_STEPS[tier] || [] : [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/50">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval Workflow</h1>
          <p className="text-gray-500 text-sm">
            {venture.entrepreneur?.full_name} — {venture.venture_description || venture.venture_product}
          </p>
        </div>
      </div>

      {/* Venture Summary */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {venture.venture_description || venture.venture_product || 'Venture'}
              </h2>
              {tier && <TierBadge tier={tier} />}
            </div>
            <p className="text-sm text-gray-500">
              {venture.entrepreneur?.full_name} — {venture.entrepreneur?.organization}
            </p>
          </div>
          <Badge variant={
            venture.status === 'approved' ? 'success' :
            venture.status === 'rejected' ? 'default' : 'warning'
          }>
            {venture.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </Badge>
        </div>
      </Card>

      {/* Approval Chain Visual */}
      <Card className="mb-6">
        <CardTitle>Approval Chain</CardTitle>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          {tier ? `${tier.charAt(0).toUpperCase() + tier.slice(1)} tier requires ${steps.length} approvals` : 'No tier assigned'}
        </p>

        {chain && chain.length > 0 ? (
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-6">
              {chain.map((item, index) => {
                const isApproved = item.status === 'approved';
                const isRejected = item.status === 'rejected';
                const isPending = item.status === 'pending';
                const isCurrent = isPending && (index === 0 || chain[index - 1]?.status === 'approved');

                return (
                  <div key={item.id} className="relative flex items-start gap-4">
                    {/* Status dot */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isApproved ? 'bg-green-100' :
                      isRejected ? 'bg-red-100' :
                      isCurrent ? 'bg-primary-100 ring-2 ring-primary-300 ring-offset-2' :
                      'bg-gray-100'
                    }`}>
                      {isApproved ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : isRejected ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : isCurrent ? (
                        <Clock className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Step {item.sequence_number}: {ROLE_LABELS[item.approver_role] || item.approver_role}
                        </h3>
                        <Badge variant={
                          isApproved ? 'success' :
                          isRejected ? 'default' :
                          isCurrent ? 'warning' : 'default'
                        }>
                          {isApproved ? 'Approved' : isRejected ? 'Rejected' : isCurrent ? 'Awaiting' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{item.approver?.full_name || 'Unassigned'}</span>
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{item.notes}"</p>
                      )}
                      {item.decided_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(item.decided_at).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No approval chain configured</p>
            <p className="text-sm text-gray-400">The triage decision needs to be made first.</p>
          </div>
        )}
      </Card>

      {/* Current User's Approval Action */}
      {canApprove && (
        <Card className="mb-6">
          <CardTitle>Your Decision</CardTitle>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            As {ROLE_LABELS[currentUserApproval!.approver_role]}, please review and make your decision.
          </p>

          <div className="mb-4">
            <Textarea
              label="Notes (optional)"
              placeholder="Add any notes about your decision..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              size="lg"
              loading={submitting}
              onClick={() => handleDecision('rejected')}
              icon={<X className="w-4 h-4" />}
            >
              Reject
            </Button>
            <Button
              size="lg"
              loading={submitting}
              onClick={() => handleDecision('approved')}
              icon={<Check className="w-4 h-4" />}
            >
              Approve
            </Button>
          </div>
        </Card>
      )}

      {/* Final Status */}
      {venture.status === 'approved' && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Fully Approved</h3>
              <p className="text-sm text-green-700">This venture has been approved at all levels. Agreement has been generated.</p>
            </div>
          </div>
        </Card>
      )}

      {venture.status === 'rejected' && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Rejected</h3>
              <p className="text-sm text-red-700">This venture has been rejected in the approval process.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
