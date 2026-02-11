import { useNavigate } from 'react-router-dom';
import { Check, X, Clock, BookOpen } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge, TierBadge } from '../common/Badge';
import { Button } from '../common/Button';

const MOCK_REQUESTS = [
  {
    id: '1',
    venture_name: 'Germany Export - Cricket Equipment',
    entrepreneur: 'Rajesh Kumar',
    stream: 'Operations & Supply Chain',
    tier: 'core' as const,
    request: 'Need guidance on EU customs documentation and logistics partners',
    ai_briefing: 'Venture is exporting sports equipment from Punjab to Germany. Currently stuck on logistics setup.',
    status: 'pending' as const,
  },
  {
    id: '2',
    venture_name: 'Organic Spice Brand - US Market',
    entrepreneur: 'Priya Mehta',
    stream: 'Go-to-Market (GTM)',
    tier: 'select' as const,
    request: 'Help with US FDA compliance and organic certification for spice exports',
    ai_briefing: 'Organic spice manufacturer from Kerala entering US market. Strong product, needs regulatory guidance.',
    status: 'pending' as const,
  },
];

const MOCK_ACTIVE = [
  {
    id: '3',
    venture_name: 'EV Charging Stations - Gujarat',
    entrepreneur: 'Neha Shah',
    stream: 'Capital & Funding',
    next_session: '2026-02-14',
  },
];

export function MentorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
        <p className="text-gray-500 mt-1">{MOCK_REQUESTS.length} pending requests, {MOCK_ACTIVE.length} active assignments</p>
      </div>

      {/* Pending Requests */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Requests</h2>
        <div className="space-y-4">
          {MOCK_REQUESTS.map((req) => (
            <Card key={req.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{req.venture_name}</h3>
                    <TierBadge tier={req.tier} />
                  </div>
                  <p className="text-sm text-gray-500">{req.entrepreneur} — <span className="text-primary-600">{req.stream}</span></p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Request:</span> {req.request}</p>
                <p className="text-xs text-gray-500"><span className="font-medium">AI Briefing:</span> {req.ai_briefing}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  icon={<Check className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/workbench/1`)}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<X className="w-3.5 h-3.5" />}
                >
                  Decline
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Assignments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Assignments</h2>
        <div className="space-y-4">
          {MOCK_ACTIVE.map((assignment) => (
            <Card key={assignment.id} hover onClick={() => navigate(`/workbench/1`)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{assignment.venture_name}</h3>
                    <p className="text-xs text-gray-500">{assignment.entrepreneur} — {assignment.stream}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  Next: {new Date(assignment.next_session).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
