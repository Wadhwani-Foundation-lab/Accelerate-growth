import { useNavigate } from 'react-router-dom';
import { Check, Clock, TrendingUp, AlertTriangle, Briefcase } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, TierBadge } from '../common/Badge';
import type { VentureTier } from '../../types';
import { usePendingApprovals, useVentures } from '../../hooks/useVentures';
import { useAuth } from '../../contexts/AuthContext';

export function FieldHeadDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: pendingApprovals, isLoading: approvalsLoading } = usePendingApprovals();
  const { data: ventures, isLoading: venturesLoading } = useVentures();

  const activeVentures = (ventures || []).filter((v) =>
    ['active', 'approved', 'under_review'].includes(v.status)
  );
  const atRisk = activeVentures.filter((v) => v.overall_rag === 'red').length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Field Head Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {profile?.geography ? `${profile.geography} region` : 'Regional overview'} — {activeVentures.length} ventures
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeVentures.length}</p>
              <p className="text-xs text-gray-500">Active Ventures</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{pendingApprovals?.length || 0}</p>
              <p className="text-xs text-gray-500">Pending Approvals</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{atRisk}</p>
              <p className="text-xs text-gray-500">At Risk</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {activeVentures.filter((v) => v.overall_rag === 'green' || v.overall_rag === 'complete').length}
              </p>
              <p className="text-xs text-gray-500">On Track</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Pending Approvals ({pendingApprovals?.length || 0})
        </h2>

        {approvalsLoading ? (
          <Card className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </Card>
        ) : (pendingApprovals || []).length === 0 ? (
          <Card className="text-center py-8">
            <Check className="w-10 h-10 text-green-300 mx-auto mb-2" />
            <p className="text-gray-500">No pending approvals</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingApprovals!.map((approval: any) => (
              <Card key={approval.id} hover onClick={() => navigate(`/approvals/${approval.venture_id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {approval.venture?.venture_description || approval.venture?.venture_product || 'Venture'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {approval.venture?.entrepreneur?.full_name} — {approval.venture?.entrepreneur?.organization}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {approval.venture?.tier && <TierBadge tier={approval.venture.tier as VentureTier} />}
                        <Badge variant="warning">Awaiting Your Approval</Badge>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(approval.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Ventures */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          All Ventures ({activeVentures.length})
        </h2>

        {venturesLoading ? (
          <Card className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </Card>
        ) : activeVentures.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No active ventures in your region</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeVentures.map((v) => (
              <Card key={v.id} hover onClick={() => navigate(`/workbench/${v.id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {v.venture_description || v.venture_product || 'Venture'}
                      </h3>
                      {v.tier && <TierBadge tier={v.tier as VentureTier} />}
                    </div>
                    <p className="text-xs text-gray-500">
                      {v.entrepreneur?.full_name} — {v.entrepreneur?.organization}
                    </p>
                  </div>
                  <Badge variant={
                    v.status === 'active' ? 'success' :
                    v.status === 'under_review' ? 'warning' : 'info'
                  }>
                    {v.status.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
