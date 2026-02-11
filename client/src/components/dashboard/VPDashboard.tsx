import { useNavigate } from 'react-router-dom';
import { Calendar, Briefcase } from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { TierBadge } from '../common/Badge';
import { RAGDot } from '../common/RAGBadge';
import type { RAGStatus } from '../../types';

interface VentureCard {
  id: string;
  name: string;
  entrepreneur: string;
  tier: 'prime' | 'core' | 'select';
  streams: RAGStatus[];
  next_checkin: string;
}

const MOCK_VP_VENTURES: VentureCard[] = [
  { id: '1', name: 'Germany Export - Cricket Equipment', entrepreneur: 'Rajesh Kumar', tier: 'core', streams: ['green', 'green', 'yellow', 'red', 'yellow', 'complete'], next_checkin: '2026-02-15' },
  { id: '2', name: 'Organic Spice Brand - US Market', entrepreneur: 'Priya Mehta', tier: 'select', streams: ['green', 'green', 'green', 'green', 'yellow', 'green'], next_checkin: '2026-02-14' },
  { id: '3', name: 'Solar Panel Assembly', entrepreneur: 'Sunil Desai', tier: 'prime', streams: ['yellow', 'red', 'yellow', 'yellow', 'red', 'green'], next_checkin: '2026-02-16' },
  { id: '4', name: 'EV Charging Stations', entrepreneur: 'Neha Shah', tier: 'core', streams: ['green', 'green', 'green', 'green', 'green', 'green'], next_checkin: '2026-02-18' },
];

export function VPDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Ventures</h1>
        <p className="text-gray-500 mt-1">Venture Partner Dashboard — {MOCK_VP_VENTURES.length} assigned ventures</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-2xl font-bold text-gray-900">{MOCK_VP_VENTURES.length}</p>
          <p className="text-xs text-gray-500">Active Ventures</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-red-600">
            {MOCK_VP_VENTURES.filter((v) => v.streams.includes('red')).length}
          </p>
          <p className="text-xs text-gray-500">Red Flags</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-primary-600">2</p>
          <p className="text-xs text-gray-500">Check-ins This Week</p>
        </Card>
      </div>

      {/* Upcoming Check-ins */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary-500" />
          <CardTitle>Upcoming Check-ins</CardTitle>
        </div>
        <div className="space-y-2">
          {MOCK_VP_VENTURES.slice(0, 3).map((v) => (
            <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{v.name}</p>
                <p className="text-xs text-gray-500">{v.entrepreneur}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(v.next_checkin).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Venture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_VP_VENTURES.map((venture) => (
          <Card
            key={venture.id}
            hover
            onClick={() => navigate(`/workbench/${venture.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{venture.name}</h3>
                  <p className="text-xs text-gray-500">{venture.entrepreneur}</p>
                </div>
              </div>
              <TierBadge tier={venture.tier} />
            </div>

            {/* Mini RAG Grid */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              {['Cap', 'Prod', 'Ppl', 'Ops', 'GTM', 'Proc'].map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <RAGDot status={venture.streams[i]} />
                  <span className="text-[10px] text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
