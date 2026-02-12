import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import type { RAGStatus, VentureTier } from '../../types';
import { useVenture, useVentureStreams, useSessions, useUpdateStream } from '../../hooks/useVentures';

const STREAM_ICONS = [Banknote, Package, Users, Settings, TrendingUp, Building];

export function VentureWorkbench() {
  const { ventureId } = useParams();
  const { data: venture, isLoading } = useVenture(ventureId);
  const { data: dbStreams } = useVentureStreams(ventureId);
  const { data: sessions } = useSessions(ventureId);
  const updateStream = useUpdateStream();
  const [overviewStream, setOverviewStream] = useState<number | null>(null);
  const [learnModal, setLearnModal] = useState<number | null>(null);

  function handleUpdateRAG(streamId: string, status: RAGStatus) {
    updateStream.mutate({ id: streamId, rag_status: status });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!venture) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Venture Not Found</h1>
        <p className="text-gray-500">This venture may have been removed or you don't have access.</p>
      </div>
    );
  }

  // Build stream data from DB or create defaults
  const streams = (dbStreams || []).map((s, index) => ({
    id: s.id,
    name: s.stream_name,
    end_deliverable: s.end_deliverable || `End deliverable for ${s.stream_name}`,
    owner: s.owner_name || venture.entrepreneur?.full_name || '—',
    target_quarter: s.target_quarter || 'TBD',
    rag_status: (s.rag_status || 'green') as RAGStatus,
    deliverables: (s.deliverables || []).map((d) => ({
      title: d.title,
      status: d.status as 'completed' | 'in_progress' | 'pending',
      target_date: d.target_date || '',
    })),
    current_deliverable_index: (s.deliverables || []).findIndex((d) => d.is_current),
    icon_index: index,
  }));

  // Session-derived engagement data
  const sessionSummaries = sessions?.filter((s) => s.ai_summary) || [];
  const challenges = sessionSummaries.flatMap((s) => s.ai_summary?.challenges || []).slice(0, 5);
  const actionsBeneficiary = sessionSummaries.flatMap((s) => s.ai_summary?.action_items_beneficiary || []).slice(0, 5);
  const actionsFoundation = sessionSummaries.flatMap((s) => s.ai_summary?.action_items_foundation || []).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      {/* A. Venture Header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900">
                {venture.venture_description || venture.venture_product || 'Venture'}
              </h1>
              {venture.tier && <TierBadge tier={venture.tier as VentureTier} />}
              <RAGBadge status={(venture.overall_rag || 'green') as RAGStatus} showLabel />
            </div>
            <p className="text-sm text-gray-500">
              {venture.current_product} → {venture.venture_product || 'New venture'}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {venture.current_geography && <Badge>{venture.current_geography}</Badge>}
              {venture.venture_geography && <Badge>{venture.venture_geography}</Badge>}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm text-gray-600 sm:text-right">
            {venture.venture_partner && (
              <div className="flex items-center gap-1.5 sm:justify-end">
                <User className="w-3.5 h-3.5" />
                <span>VP: <span className="font-medium">{venture.venture_partner.full_name}</span></span>
              </div>
            )}
            {venture.success_manager && (
              <div className="flex items-center gap-1.5 sm:justify-end">
                <User className="w-3.5 h-3.5" />
                <span>CSM: <span className="font-medium">{venture.success_manager.full_name}</span></span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* B. Six Stream Tiles */}
      {streams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {streams.map((stream, index) => {
            const Icon = STREAM_ICONS[stream.icon_index % 6] || Banknote;
            const currentDelIdx = stream.current_deliverable_index >= 0 ? stream.current_deliverable_index : 0;
            const currentDel = stream.deliverables[currentDelIdx];

            return (
              <Card key={stream.id} padding="none" className="overflow-hidden">
                {/* Section 1: Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{stream.name}</h3>
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
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <RAGSelector
                      value={stream.rag_status}
                      onChange={(s) => handleUpdateRAG(stream.id, s)}
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
                {stream.deliverables.length > 0 && (
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
                            di === currentDelIdx ? 'bg-primary-50 border border-primary-200' : ''
                          }`}
                        >
                          {del.status === 'completed' ? (
                            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          ) : di === currentDelIdx ? (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-500 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                          )}
                          <span className={`flex-1 ${del.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {del.title}
                          </span>
                          {del.target_date && <span className="text-gray-400">{del.target_date}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 3: Support Actions */}
                <div className="p-4">
                  {currentDel && (
                    <p className="text-xs text-gray-500 mb-2">
                      Support for: <span className="font-medium text-gray-700">{currentDel.title}</span>
                    </p>
                  )}
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
      ) : (
        <Card className="mb-6 text-center py-8">
          <p className="text-gray-500">No streams configured yet. Streams will appear once the agreement is accepted.</p>
        </Card>
      )}

      {/* C. Engagement Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <CardTitle>Challenges Summary</CardTitle>
          </div>
          {challenges.length > 0 ? (
            <div className="space-y-2">
              {challenges.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  {c}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No challenges recorded yet. They will appear after check-in sessions.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-blue-500" />
            <CardTitle>Action Items — You</CardTitle>
          </div>
          {actionsBeneficiary.length > 0 ? (
            <div className="space-y-2">
              {actionsBeneficiary.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Action items will appear after sessions are recorded.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-green-500" />
            <CardTitle>Action Items — Foundation</CardTitle>
          </div>
          {actionsFoundation.length > 0 ? (
            <div className="space-y-2">
              {actionsFoundation.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Foundation action items will appear after sessions.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <CardTitle>Session History</CardTitle>
          </div>
          {(sessions || []).length > 0 ? (
            <div className="space-y-3">
              {sessions!.map((session) => (
                <div key={session.id} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900">
                      {session.session_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(session.session_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {session.conductor && (
                    <p className="text-xs text-gray-500">By: {session.conductor.full_name}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No sessions recorded yet.</p>
          )}
        </Card>
      </div>

      {/* Overview Modal */}
      <Modal
        isOpen={overviewStream !== null}
        onClose={() => setOverviewStream(null)}
        title={overviewStream !== null ? `${streams[overviewStream]?.name} — Overview` : ''}
        size="lg"
      >
        {overviewStream !== null && streams[overviewStream] && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              AI-generated overview of the {streams[overviewStream].name} stream.
              This content is contextualized to your specific industry, geography, and venture details.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                [AI-generated stream overview will appear here once the AI service is connected]
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
        title={learnModal !== null && streams[learnModal] ? `Playbook: ${streams[learnModal].deliverables[streams[learnModal].current_deliverable_index]?.title || streams[learnModal].name}` : ''}
        size="xl"
      >
        {learnModal !== null && streams[learnModal] && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Step-by-step execution guide for this deliverable.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {step}
                  </span>
                  <p className="text-sm text-gray-700">
                    [AI-generated execution step {step} — will be contextual to this venture]
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
