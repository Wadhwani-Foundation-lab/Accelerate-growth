import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, TrendingUp, Users, Briefcase } from 'lucide-react';
import { Card } from '../common/Card';
import { TierBadge } from '../common/Badge';
import { RAGDot } from '../common/RAGBadge';
import type { RAGStatus, VentureTier } from '../../types';
import { useVenturesWithStreams } from '../../hooks/useVentures';

const STREAM_NAMES = ['Capital', 'Product', 'People', 'Ops', 'GTM', 'Procure'];

export function CSMDashboard() {
  const navigate = useNavigate();
  const { data: ventures, isLoading } = useVenturesWithStreams();
  const [search, setSearch] = useState('');

  const filtered = (ventures || []).filter(
    (v) => !search ||
      v.entrepreneur?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.venture_description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalVentures = filtered.length;
  const atRisk = filtered.filter((v) =>
    v.venture_streams?.some((s) => s.rag_status === 'red')
  ).length;
  const onTrack = filtered.filter((v) =>
    !v.venture_streams?.some((s) => s.rag_status === 'red' || s.rag_status === 'yellow')
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
        <p className="text-gray-500 mt-1">Customer Success Manager view — {totalVentures} active ventures</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalVentures}</p>
              <p className="text-xs text-gray-500">Total Ventures</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{onTrack}</p>
              <p className="text-xs text-gray-500">On Track</p>
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
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-500">Jobs Projected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search ventures..."
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

      {/* RAG Grid */}
      {isLoading ? (
        <Card className="text-center py-12">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading portfolio...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No ventures in portfolio</p>
          <p className="text-sm text-gray-400 mt-1">Ventures will appear here once they are active.</p>
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Venture</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-2 py-3">Tier</th>
                  {STREAM_NAMES.map((name) => (
                    <th key={name} className="text-center text-xs font-medium text-gray-500 px-2 py-3">{name}</th>
                  ))}
                  <th className="text-center text-xs font-medium text-gray-500 px-2 py-3">Alert</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((venture) => {
                  const streamMap = new Map(
                    venture.venture_streams?.map((s) => [s.stream_number, s.rag_status]) || []
                  );
                  const hasRed = venture.venture_streams?.some((s) => s.rag_status === 'red');

                  return (
                    <tr
                      key={venture.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/workbench/${venture.id}`)}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {venture.venture_description || venture.venture_product || 'Venture'}
                        </p>
                        <p className="text-xs text-gray-500">{venture.entrepreneur?.full_name}</p>
                      </td>
                      <td className="px-2 py-3">
                        {venture.tier && <TierBadge tier={venture.tier as VentureTier} />}
                      </td>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <td key={num} className="px-2 py-3 text-center">
                          <div className="flex justify-center">
                            <RAGDot status={(streamMap.get(num) || 'green') as RAGStatus} />
                          </div>
                        </td>
                      ))}
                      <td className="px-2 py-3 text-center">
                        {hasRed && <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
