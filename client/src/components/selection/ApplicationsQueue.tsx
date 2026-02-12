import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Clock } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useVentures } from '../../hooks/useVentures';

const statusVariants: Record<string, { label: string; variant: 'default' | 'warning' | 'success' | 'info' }> = {
  draft: { label: 'Draft', variant: 'default' },
  submitted: { label: 'Submitted', variant: 'info' },
  under_review: { label: 'Under Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'default' },
  self_serve: { label: 'Self-Serve', variant: 'default' },
  active: { label: 'Active', variant: 'success' },
};

export function ApplicationsQueue() {
  const navigate = useNavigate();
  const { data: ventures, isLoading } = useVentures();
  const [search, setSearch] = useState('');

  // Filter to show applications (submitted, under_review, approved, rejected)
  const applications = (ventures || []).filter(
    (v) => ['submitted', 'under_review', 'approved', 'rejected', 'self_serve'].includes(v.status)
  );

  const filtered = applications.filter(
    (app) =>
      !search ||
      app.entrepreneur?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.venture_description?.toLowerCase().includes(search.toLowerCase()) ||
      app.venture_product?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">
          {isLoading ? 'Loading...' : `${filtered.length} applications to review`}
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search by name or venture..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </Card>

      {/* Applications List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No applications found</p>
          <p className="text-sm text-gray-400 mt-1">Applications will appear here once entrepreneurs submit them.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const statusConfig = statusVariants[app.status] || statusVariants.submitted;
            const revenueLabels: Record<string, string> = {
              '1cr': '₹1 Cr', '5cr': '₹5 Cr', '10cr': '₹10 Cr', '50cr': '₹50 Cr', '100cr_plus': '₹100 Cr+',
            };
            return (
              <Card
                key={app.id}
                hover
                onClick={() => navigate(`/review/${app.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {app.entrepreneur?.full_name || 'Unknown'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {app.entrepreneur?.organization || ''}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {app.venture_description || `${app.venture_product || ''} ${app.venture_geography ? `to ${app.venture_geography}` : ''}`}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {app.expected_revenue_range && (
                          <span className="text-xs text-gray-500">
                            Revenue: <span className="font-medium text-gray-700">
                              {revenueLabels[app.expected_revenue_range] || app.expected_revenue_range}
                            </span>
                          </span>
                        )}
                        {app.source && (
                          <Badge>
                            {app.source.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(app.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
