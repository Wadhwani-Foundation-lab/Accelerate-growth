import { useNavigate } from 'react-router-dom';
import { Check, X, BookOpen } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useMentorRequests, useUpdateMentorRequest } from '../../hooks/useVentures';

export function MentorDashboard() {
  const navigate = useNavigate();
  const { data: requests, isLoading } = useMentorRequests();
  const updateRequest = useUpdateMentorRequest();

  const pending = (requests || []).filter((r) => r.status === 'pending');
  const active = (requests || []).filter((r) => r.status === 'accepted');

  function handleAccept(id: string) {
    updateRequest.mutate({ id, status: 'accepted' });
  }

  function handleDecline(id: string) {
    updateRequest.mutate({ id, status: 'declined' });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mentor Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {isLoading ? 'Loading...' : `${pending.length} pending requests, ${active.length} active assignments`}
        </p>
      </div>

      {/* Pending Requests */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Requests</h2>
        {isLoading ? (
          <Card className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </Card>
        ) : pending.length === 0 ? (
          <Card className="text-center py-8">
            <Check className="w-10 h-10 text-green-300 mx-auto mb-2" />
            <p className="text-gray-500">No pending requests</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pending.map((req) => (
              <Card key={req.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {(req as any).venture?.venture_description || 'Venture'}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      {(req as any).venture?.entrepreneur?.full_name || '—'} — {(req as any).stream?.stream_name || '—'}
                    </p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  {req.request_details && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Request:</span> {req.request_details}
                    </p>
                  )}
                  {req.ai_briefing && (
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">AI Briefing:</span> {req.ai_briefing}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    icon={<Check className="w-3.5 h-3.5" />}
                    onClick={() => handleAccept(req.id)}
                    loading={updateRequest.isPending}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<X className="w-3.5 h-3.5" />}
                    onClick={() => handleDecline(req.id)}
                    loading={updateRequest.isPending}
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Assignments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Assignments</h2>
        {active.length === 0 ? (
          <Card className="text-center py-8">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No active assignments</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {active.map((assignment) => (
              <Card
                key={assignment.id}
                hover
                onClick={() => navigate(`/workbench/${assignment.venture_id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {(assignment as any).venture?.venture_description || 'Venture'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {(assignment as any).venture?.entrepreneur?.full_name || '—'} — {(assignment as any).stream?.stream_name || '—'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
