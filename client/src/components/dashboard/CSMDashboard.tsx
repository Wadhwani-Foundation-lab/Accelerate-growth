import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, TrendingUp, Users, Briefcase } from 'lucide-react';
import { Card } from '../common/Card';
import { TierBadge } from '../common/Badge';
import { RAGDot } from '../common/RAGBadge';
import type { RAGStatus } from '../../types';

interface VentureRow {
  id: string;
  name: string;
  entrepreneur: string;
  tier: 'prime' | 'core' | 'select';
  streams: RAGStatus[];
  engagement: { learn: number; connect: number; do_: number };
  alert: boolean;
}

const MOCK_VENTURES: VentureRow[] = [
  {
    id: '1', name: 'Germany Export - Cricket Equipment', entrepreneur: 'Rajesh Kumar',
    tier: 'core', streams: ['green', 'green', 'yellow', 'red', 'yellow', 'complete'],
    engagement: { learn: 8, connect: 3, do_: 2 }, alert: true,
  },
  {
    id: '2', name: 'Organic Spice Brand - US Market', entrepreneur: 'Priya Mehta',
    tier: 'select', streams: ['green', 'green', 'green', 'green', 'yellow', 'green'],
    engagement: { learn: 12, connect: 5, do_: 0 }, alert: false,
  },
  {
    id: '3', name: 'Solar Panel Assembly - Maharashtra', entrepreneur: 'Sunil Desai',
    tier: 'prime', streams: ['yellow', 'red', 'yellow', 'yellow', 'red', 'green'],
    engagement: { learn: 2, connect: 0, do_: 0 }, alert: true,
  },
  {
    id: '4', name: 'EV Charging Stations - Gujarat', entrepreneur: 'Neha Shah',
    tier: 'core', streams: ['green', 'green', 'green', 'green', 'green', 'green'],
    engagement: { learn: 15, connect: 8, do_: 4 }, alert: false,
  },
  {
    id: '5', name: 'Handloom to E-commerce', entrepreneur: 'Kamala Devi',
    tier: 'prime', streams: ['complete', 'green', 'complete', 'yellow', 'red', 'complete'],
    engagement: { learn: 6, connect: 2, do_: 1 }, alert: false,
  },
  {
    id: '6', name: 'Frozen Food Export - Middle East', entrepreneur: 'Ahmed Khan',
    tier: 'select', streams: ['green', 'yellow', 'green', 'green', 'green', 'yellow'],
    engagement: { learn: 10, connect: 4, do_: 3 }, alert: false,
  },
];

const STREAM_NAMES = ['Capital', 'Product', 'People', 'Ops', 'GTM', 'Procure'];

export function CSMDashboard() {
  const navigate = useNavigate();

  const totalVentures = MOCK_VENTURES.length;
  const atRisk = MOCK_VENTURES.filter((v) => v.streams.includes('red')).length;
  const onTrack = MOCK_VENTURES.filter((v) => !v.streams.includes('red') && !v.streams.includes('yellow')).length;

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
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500">Jobs Projected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="mb-6" padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search ventures..."
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </Card>

      {/* RAG Grid */}
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
                <th className="text-center text-xs font-medium text-gray-500 px-2 py-3">Learn</th>
                <th className="text-center text-xs font-medium text-gray-500 px-2 py-3">Connect</th>
                <th className="text-center text-xs font-medium text-gray-500 px-2 py-3">Do</th>
                <th className="text-center text-xs font-medium text-gray-500 px-2 py-3">Alert</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VENTURES.map((venture) => (
                <tr
                  key={venture.id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/workbench/${venture.id}`)}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{venture.name}</p>
                    <p className="text-xs text-gray-500">{venture.entrepreneur}</p>
                  </td>
                  <td className="px-2 py-3">
                    <TierBadge tier={venture.tier} />
                  </td>
                  {venture.streams.map((status, i) => (
                    <td key={i} className="px-2 py-3 text-center">
                      <div className="flex justify-center">
                        <RAGDot status={status} />
                      </div>
                    </td>
                  ))}
                  <td className="px-2 py-3 text-center text-xs text-gray-600">{venture.engagement.learn}h</td>
                  <td className="px-2 py-3 text-center text-xs text-gray-600">{venture.engagement.connect}h</td>
                  <td className="px-2 py-3 text-center text-xs text-gray-600">{venture.engagement.do_}h</td>
                  <td className="px-2 py-3 text-center">
                    {venture.alert && <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
