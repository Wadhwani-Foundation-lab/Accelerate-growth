import { useState } from 'react';
import {
  Banknote, Package, Users, Settings, TrendingUp, Building,
  BookOpen, Link2, Wrench, Eye, ChevronDown, Check, Calendar,
  User, MessageSquare, ListTodo, AlertCircle,
} from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { Badge, TierBadge } from '../common/Badge';
import { RAGBadge, RAGSelector } from '../common/RAGBadge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { RAGStatus } from '../../types';

const STREAM_ICONS = [Banknote, Package, Users, Settings, TrendingUp, Building];

interface StreamData {
  name: string;
  end_deliverable: string;
  owner: string;
  target_quarter: string;
  rag_status: RAGStatus;
  deliverables: { title: string; status: 'completed' | 'in_progress' | 'pending'; target_date: string }[];
  current_deliverable_index: number;
}

// Mock workbench data
const MOCK_VENTURE = {
  name: 'Germany Export - Cricket Equipment',
  description: 'Expanding soccer ball manufacturing to cricket equipment and entering the German market',
  sector: 'Sports Manufacturing',
  geography: 'Punjab → Germany',
  tier: 'core' as const,
  venture_partner: 'Arun Goel',
  success_manager: 'Niju Prabha',
  overall_rag: 'yellow' as RAGStatus,
};

const MOCK_STREAMS: StreamData[] = [
  {
    name: 'Capital & Funding',
    end_deliverable: 'Secured export financing and working capital',
    owner: 'Rajesh Kumar',
    target_quarter: 'Q3 2026',
    rag_status: 'green',
    deliverables: [
      { title: 'Complete financial projections', status: 'completed', target_date: '2026-03' },
      { title: 'Identify export financing schemes', status: 'completed', target_date: '2026-03' },
      { title: 'Prepare loan application', status: 'in_progress', target_date: '2026-04' },
      { title: 'Secure working capital facility', status: 'pending', target_date: '2026-05' },
      { title: 'Set up forex accounts', status: 'pending', target_date: '2026-06' },
    ],
    current_deliverable_index: 2,
  },
  {
    name: 'Product / Service',
    end_deliverable: 'DIN-certified cricket equipment for German market',
    owner: 'Vikram Singh',
    target_quarter: 'Q2 2026',
    rag_status: 'green',
    deliverables: [
      { title: 'German market product research', status: 'completed', target_date: '2026-02' },
      { title: 'Develop DIN-standard prototypes', status: 'completed', target_date: '2026-03' },
      { title: 'Obtain DIN/CE certifications', status: 'in_progress', target_date: '2026-04' },
      { title: 'Product testing with German clubs', status: 'pending', target_date: '2026-05' },
      { title: 'Finalize product line + pricing', status: 'pending', target_date: '2026-06' },
    ],
    current_deliverable_index: 2,
  },
  {
    name: 'People & Talent',
    end_deliverable: 'Export team assembled and operational',
    owner: 'Rajesh Kumar',
    target_quarter: 'Q2 2026',
    rag_status: 'yellow',
    deliverables: [
      { title: 'Define export team structure', status: 'completed', target_date: '2026-02' },
      { title: 'Hire export manager', status: 'in_progress', target_date: '2026-03' },
      { title: 'Train production staff', status: 'pending', target_date: '2026-04' },
      { title: 'German-speaking support hire', status: 'pending', target_date: '2026-05' },
      { title: 'Performance metrics setup', status: 'pending', target_date: '2026-06' },
    ],
    current_deliverable_index: 1,
  },
  {
    name: 'Operations & Supply Chain',
    end_deliverable: 'End-to-end export supply chain operational',
    owner: 'Suresh Patel',
    target_quarter: 'Q3 2026',
    rag_status: 'red',
    deliverables: [
      { title: 'Identify EU logistics partners', status: 'in_progress', target_date: '2026-03' },
      { title: 'Export documentation process', status: 'pending', target_date: '2026-04' },
      { title: 'Quality control for exports', status: 'pending', target_date: '2026-05' },
      { title: 'Configure German warehousing', status: 'pending', target_date: '2026-06' },
      { title: 'Pilot shipment test', status: 'pending', target_date: '2026-07' },
    ],
    current_deliverable_index: 0,
  },
  {
    name: 'Go-to-Market (GTM)',
    end_deliverable: 'Sales pipeline with German cricket clubs & retailers',
    owner: 'Amit Sharma',
    target_quarter: 'Q4 2026',
    rag_status: 'yellow',
    deliverables: [
      { title: 'Map German cricket ecosystem', status: 'completed', target_date: '2026-03' },
      { title: 'Germany-specific marketing materials', status: 'in_progress', target_date: '2026-04' },
      { title: 'Secure distribution partner', status: 'pending', target_date: '2026-05' },
      { title: 'Launch marketing campaign', status: 'pending', target_date: '2026-07' },
      { title: 'Close first 5 B2B accounts', status: 'pending', target_date: '2026-09' },
    ],
    current_deliverable_index: 1,
  },
  {
    name: 'Procurement & Infrastructure',
    end_deliverable: 'Production capacity scaled for export volume',
    owner: 'Vikram Singh',
    target_quarter: 'Q2 2026',
    rag_status: 'complete',
    deliverables: [
      { title: 'Production capacity audit', status: 'completed', target_date: '2026-02' },
      { title: 'Procure cricket line equipment', status: 'completed', target_date: '2026-02' },
      { title: 'Export packaging facility setup', status: 'completed', target_date: '2026-03' },
      { title: 'Implement export ERP module', status: 'completed', target_date: '2026-03' },
      { title: 'Obtain export licenses', status: 'completed', target_date: '2026-03' },
    ],
    current_deliverable_index: 4,
  },
];

const MOCK_ENGAGEMENT = {
  challenges: [
    'Finding reliable logistics partners for EU shipping with competitive rates',
    'DIN certification process taking longer than expected - need German testing lab contacts',
    'Difficulty hiring export manager with European cricket market experience',
  ],
  action_items_beneficiary: [
    'Submit revised financial projections by March 15',
    'Schedule DIN certification lab visit in Frankfurt',
    'Post export manager job on LinkedIn Germany',
  ],
  action_items_foundation: [
    'Connect with German sports trade association (DSSV)',
    'Share EU logistics provider database',
    'Introduce to cricket equipment distributor in Munich',
  ],
  sessions: [
    { date: '2026-02-05', type: 'Venture Partner Check-in #1', summary: 'Initial workbench setup, validated stream priorities' },
    { date: '2026-01-28', type: 'Mentor Session - Supply Chain', summary: 'Discussed EU customs requirements, recommended freight forwarders' },
  ],
};

export function VentureWorkbench() {
  const [streams, setStreams] = useState(MOCK_STREAMS);
  const [overviewStream, setOverviewStream] = useState<number | null>(null);
  const [learnModal, setLearnModal] = useState<number | null>(null);
  const venture = MOCK_VENTURE;
  const engagement = MOCK_ENGAGEMENT;

  function updateStreamRAG(index: number, status: RAGStatus) {
    setStreams((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], rag_status: status };
      return next;
    });
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* A. Venture Header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{venture.name}</h1>
              <TierBadge tier={venture.tier} />
              <RAGBadge status={venture.overall_rag} showLabel />
            </div>
            <p className="text-sm text-gray-500">{venture.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge>{venture.sector}</Badge>
              <Badge>{venture.geography}</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-600 sm:text-right">
            <div className="flex items-center gap-1.5 sm:justify-end">
              <User className="w-3.5 h-3.5" />
              <span>VP: <span className="font-medium">{venture.venture_partner}</span></span>
            </div>
            <div className="flex items-center gap-1.5 sm:justify-end">
              <User className="w-3.5 h-3.5" />
              <span>CSM: <span className="font-medium">{venture.success_manager}</span></span>
            </div>
          </div>
        </div>
      </Card>

      {/* B. Six Stream Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {streams.map((stream, index) => {
          const Icon = STREAM_ICONS[index];
          const currentDel = stream.deliverables[stream.current_deliverable_index];

          return (
            <Card key={stream.name} padding="none" className="overflow-hidden">
              {/* Section 1: Stream Status (Header) */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{stream.name}</h3>
                    </div>
                  </div>
                  <RAGBadge status={stream.rag_status} size="lg" />
                </div>
                <p className="text-xs text-gray-500 mb-2">{stream.end_deliverable}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{stream.owner}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{stream.target_quarter}</span>
                  </div>
                </div>

                {/* RAG Selector + Overview */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <RAGSelector
                    value={stream.rag_status}
                    onChange={(s) => updateStreamRAG(index, s)}
                  />
                  <button
                    onClick={() => setOverviewStream(index)}
                    className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Overview
                  </button>
                </div>
              </div>

              {/* Section 2: Deliverables */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Deliverables</span>
                </div>
                <div className="space-y-1.5">
                  {stream.deliverables.map((del, di) => (
                    <div
                      key={di}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                        di === stream.current_deliverable_index
                          ? 'bg-primary-50 border border-primary-200'
                          : ''
                      }`}
                    >
                      {del.status === 'completed' ? (
                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      ) : di === stream.current_deliverable_index ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-500 flex-shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                      )}
                      <span className={`flex-1 ${del.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                        {del.title}
                      </span>
                      <span className="text-gray-400">{del.target_date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Support Actions */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-2">
                  Support for: <span className="font-medium text-gray-700">{currentDel?.title}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLearnModal(index)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Learn
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-medium transition-colors">
                    <Link2 className="w-3.5 h-3.5" />
                    Connect
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium transition-colors">
                    <Wrench className="w-3.5 h-3.5" />
                    Do
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* C. Engagement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Challenges */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <CardTitle>Challenges Summary</CardTitle>
          </div>
          <div className="space-y-2">
            {engagement.challenges.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                {c}
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-primary-600 hover:text-primary-700 font-medium">
            Edit challenges
          </button>
        </Card>

        {/* Action Items - Beneficiary */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-blue-500" />
            <CardTitle>Action Items — You</CardTitle>
          </div>
          <div className="space-y-2">
            {engagement.action_items_beneficiary.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                {item}
              </div>
            ))}
          </div>
        </Card>

        {/* Action Items - Foundation */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-green-500" />
            <CardTitle>Action Items — Foundation</CardTitle>
          </div>
          <div className="space-y-2">
            {engagement.action_items_foundation.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                {item}
              </div>
            ))}
          </div>
        </Card>

        {/* Session History */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <CardTitle>Session History</CardTitle>
          </div>
          <div className="space-y-3">
            {engagement.sessions.map((session, i) => (
              <div key={i} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900">{session.type}</span>
                  <span className="text-xs text-gray-400">{session.date}</span>
                </div>
                <p className="text-xs text-gray-600">{session.summary}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Overview Modal */}
      <Modal
        isOpen={overviewStream !== null}
        onClose={() => setOverviewStream(null)}
        title={overviewStream !== null ? `${streams[overviewStream].name} — Overview` : ''}
        size="lg"
      >
        {overviewStream !== null && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              AI-generated overview of the {streams[overviewStream].name} stream for this venture.
              This content is contextualized to your specific industry, geography, and venture details.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                [AI-generated stream overview content will appear here, specific to the venture context]
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">Go Deeper</Button>
              <Button variant="outline" size="sm">Podcast (Hindi)</Button>
              <Button variant="outline" size="sm">Video</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Learn Modal */}
      <Modal
        isOpen={learnModal !== null}
        onClose={() => setLearnModal(null)}
        title={learnModal !== null ? `Playbook: ${streams[learnModal].deliverables[streams[learnModal].current_deliverable_index]?.title}` : ''}
        size="xl"
      >
        {learnModal !== null && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Step-by-step execution guide for: <span className="font-medium text-gray-700">
                {streams[learnModal].deliverables[streams[learnModal].current_deliverable_index]?.title}
              </span>
            </p>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {step}
                  </span>
                  <p className="text-sm text-gray-700">
                    [AI-generated execution step {step} will appear here, contextual to the venture]
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
