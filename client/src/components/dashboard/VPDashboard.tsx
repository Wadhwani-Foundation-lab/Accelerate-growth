import { useNavigate } from 'react-router-dom';
import { Calendar, Briefcase } from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { TierBadge } from '../common/Badge';
import { RAGDot } from '../common/RAGBadge';
import type { RAGStatus, VentureTier } from '../../types';
import { useVenturesWithStreams } from '../../hooks/useVentures';

export function VPDashboard() {
  const navigate = useNavigate();
  const { data: ventures, isLoading } = useVenturesWithStreams();

  // VP sees ventures assigned to them (in production, filtered by venture_partner_id)
  const myVentures = ventures || [];
  const redFlags = myVentures.filter((v) =>
    v.venture_streams?.some((s) => s.rag_status === 'red')
  ).length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Ventures</h1>
        <p className="text-gray-500 mt-1">Venture Partner Dashboard — {myVentures.length} assigned ventures</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-2xl font-bold text-gray-900">{myVentures.length}</p>
          <p className="text-xs text-gray-500">Active Ventures</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-red-600">{redFlags}</p>
          <p className="text-xs text-gray-500">Red Flags</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-primary-600">—</p>
          <p className="text-xs text-gray-500">Check-ins This Week</p>
        </Card>
      </div>

      {isLoading ? (
        <Card className="text-center py-12">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading ventures...</p>
        </Card>
      ) : myVentures.length === 0 ? (
        <Card className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No ventures assigned yet</p>
        </Card>
      ) : (
        <>
          {/* Upcoming Check-ins */}
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary-500" />
              <CardTitle>Ventures</CardTitle>
            </div>
            <div className="space-y-2">
              {myVentures.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
                  onClick={() => navigate(`/workbench/${v.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {v.venture_description || v.venture_product || 'Venture'}
                    </p>
                    <p className="text-xs text-gray-500">{v.entrepreneur?.full_name}</p>
                  </div>
                  {v.tier && <TierBadge tier={v.tier as VentureTier} />}
                </div>
              ))}
            </div>
          </Card>

          {/* Venture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myVentures.map((venture) => {
              const streamMap = new Map(
                venture.venture_streams?.map((s) => [s.stream_number, s.rag_status]) || []
              );

              return (
                <Card key={venture.id} hover onClick={() => navigate(`/workbench/${venture.id}`)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {venture.venture_description || venture.venture_product || 'Venture'}
                        </h3>
                        <p className="text-xs text-gray-500">{venture.entrepreneur?.full_name}</p>
                      </div>
                    </div>
                    {venture.tier && <TierBadge tier={venture.tier as VentureTier} />}
                  </div>

                  {/* Mini RAG Grid */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                    {['Cap', 'Prod', 'Ppl', 'Ops', 'GTM', 'Proc'].map((label, i) => (
                      <div key={label} className="flex flex-col items-center gap-1">
                        <RAGDot status={(streamMap.get(i + 1) || 'green') as RAGStatus} />
                        <span className="text-[10px] text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
