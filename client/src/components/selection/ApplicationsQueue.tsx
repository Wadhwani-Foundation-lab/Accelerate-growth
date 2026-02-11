import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Clock } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

const MOCK_APPLICATIONS = [
  { id: '1', name: 'Rajesh Kumar', org: 'Punjab Sports Mfg', venture: 'Cricket equipment export to Germany', revenue: '₹10 Cr', source: 'CSM Referral', date: '2026-02-05', status: 'under_review' },
  { id: '2', name: 'Priya Mehta', org: 'Kerala Spice Co', venture: 'Organic spices to US market', revenue: '₹50 Cr', source: 'Self-Initiated', date: '2026-02-04', status: 'submitted' },
  { id: '3', name: 'Sunil Desai', org: 'Desai Solar', venture: 'Solar panel assembly in Maharashtra', revenue: '₹5 Cr', source: 'Ecosystem Referral', date: '2026-02-03', status: 'submitted' },
  { id: '4', name: 'Neha Shah', org: 'EV Solutions', venture: 'EV charging network in Gujarat', revenue: '₹100 Cr+', source: 'Platform Nudge', date: '2026-02-02', status: 'approved' },
  { id: '5', name: 'Kamala Devi', org: 'Handloom Heritage', venture: 'Traditional handloom to e-commerce', revenue: '₹1 Cr', source: 'CSM Referral', date: '2026-02-01', status: 'submitted' },
];

const statusVariants: Record<string, { label: string; variant: 'default' | 'warning' | 'success' | 'info' }> = {
  submitted: { label: 'Submitted', variant: 'info' },
  under_review: { label: 'Under Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'default' },
};

export function ApplicationsQueue() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 mt-1">{MOCK_APPLICATIONS.length} applications to review</p>
      </div>

      {/* Search */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search by name or venture..."
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </Card>

      {/* Applications List */}
      <div className="space-y-3">
        {MOCK_APPLICATIONS.map((app) => {
          const statusConfig = statusVariants[app.status] || statusVariants.submitted;
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
                    <h3 className="text-sm font-semibold text-gray-900">{app.name}</h3>
                    <p className="text-xs text-gray-500">{app.org}</p>
                    <p className="text-sm text-gray-700 mt-1">{app.venture}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500">Revenue: <span className="font-medium text-gray-700">{app.revenue}</span></span>
                      <Badge>{app.source}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(app.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
