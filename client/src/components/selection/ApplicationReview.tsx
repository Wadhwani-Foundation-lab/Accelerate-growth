import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  HelpCircle,
  Target,
  BarChart3,
  Users as UsersIcon,
} from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { Badge, TierBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Textarea } from '../common/Input';
import type { TriageOutcome } from '../../types';
import { useVenture, useVentureStreams, useApplicationReview, useCreateReview } from '../../hooks/useVentures';

const REVENUE_LABELS: Record<string, string> = {
  '1cr': '₹1 Crore', '5cr': '₹5 Crore', '10cr': '₹10 Crore',
  '50cr': '₹50 Crore', '100cr_plus': '₹100 Crore+',
};
const INVESTMENT_LABELS: Record<string, string> = {
  '10l': '₹10 Lakh', '50l': '₹50 Lakh', '1cr': '₹1 Crore',
  '5cr': '₹5 Crore', '10cr_plus': '₹10 Crore+',
};

const SOURCE_LABELS: Record<string, string> = {
  self_initiated: 'Self-Initiated',
  platform_nudge: 'Platform Nudge',
  csm_referral: 'CSM Referral',
  ecosystem_referral: 'Ecosystem Referral',
};

// Mock AI assessment (would come from AI service in production)
const MOCK_AI = {
  tier_recommendation: 'core' as const,
  failure_reasons: [
    'Market entry barriers may be higher than anticipated',
    'Limited track record in the target geography',
    'Working capital requirements could strain cash flow',
    'Competition from established players in this space',
    'Regulatory complexity in the target market',
  ],
  opportunity_reasons: [
    'Strong domestic foundation to build upon',
    'Growing market demand in the target segment',
    'Government incentives available for this sector',
    'Unique value proposition relative to competition',
    'Scalable business model with clear growth path',
  ],
  probing_questions: [
    'What specific distribution channels have you identified?',
    'How will you handle quality compliance requirements?',
    'What is your realistic customer acquisition cost estimate?',
    'Do you have any pilot customers or letters of intent?',
    'What is your contingency plan if initial targets are not met?',
  ],
  market_size: 'Estimated addressable market in the target segment with growth potential',
  jobs_impact: {
    creative: 20, destructive: 0, net: 20,
    description: 'New venture operations expected to create approximately 20 new jobs',
  },
};

export function ApplicationReview() {
  const { ventureId } = useParams();
  const navigate = useNavigate();
  const { data: venture, isLoading } = useVenture(ventureId);
  const { data: streams } = useVentureStreams(ventureId);
  const { data: existingReview } = useApplicationReview(ventureId);
  const createReview = useCreateReview();

  const [selectedOutcome, setSelectedOutcome] = useState<TriageOutcome | ''>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmitDecision() {
    if (!selectedOutcome || !ventureId) return;
    setSubmitting(true);
    try {
      await createReview.mutateAsync({
        venture_id: ventureId,
        triage_outcome: selectedOutcome,
        decision_notes: notes,
      });
      navigate(-1);
    } catch (err) {
      console.error('Failed to submit decision:', err);
      alert('Failed to submit decision. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h1>
        <p className="text-gray-500">This application may have been removed.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const streamData = (streams || []).map((s) => ({
    name: s.stream_name,
    status: s.self_status || 'on_it',
    support_type: s.support_type || '',
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/50">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
          <p className="text-gray-500 text-sm">
            {venture.entrepreneur?.full_name} — {venture.entrepreneur?.organization}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Application Summary */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Application Summary</CardTitle>
              {venture.source && <Badge variant="primary">{SOURCE_LABELS[venture.source]}</Badge>}
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Applicant</h4>
                <p className="font-semibold text-gray-900">{venture.entrepreneur?.full_name}</p>
                <p className="text-sm text-gray-600">{venture.entrepreneur?.organization}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Current</p>
                  <p className="text-sm font-medium">{venture.current_product || '—'}</p>
                  <p className="text-xs text-gray-500">{venture.current_segment} / {venture.current_geography}</p>
                </div>
                <div className="bg-primary-50 p-3 rounded-lg">
                  <p className="text-xs text-primary-600 mb-0.5">Venture (New)</p>
                  <p className="text-sm font-medium">{venture.venture_product || '—'}</p>
                  <p className="text-xs text-gray-500">{venture.venture_geography || '—'}</p>
                </div>
              </div>
              {venture.venture_description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Venture Description</h4>
                  <p className="text-sm text-gray-700">{venture.venture_description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Expected Revenue (Yr 3)</h4>
                  <p className="text-lg font-bold text-primary-600">
                    {REVENUE_LABELS[venture.expected_revenue_range || ''] || '—'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Willing to Invest</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {INVESTMENT_LABELS[venture.investment_willingness || ''] || '—'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Commitment</CardTitle>
            <div className="mt-3 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Progress So Far</h4>
                <p className="text-sm text-gray-700 mt-1">{venture.progress_so_far || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Resource Allocation</h4>
                <p className="text-sm text-gray-700 mt-1">{venture.resource_allocation || 'Not provided'}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Support Needs</CardTitle>
            <div className="mt-3 space-y-2">
              {streamData.length > 0 ? streamData.map((stream) => (
                <div key={stream.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{stream.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={stream.status === 'done' ? 'success' : stream.status === 'on_it' ? 'info' : 'warning'}>
                      {stream.status === 'done' ? 'Done' : stream.status === 'on_it' ? 'On It' : 'Need Help'}
                    </Badge>
                    {stream.support_type && <Badge variant="primary">{stream.support_type}</Badge>}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400">No stream data available</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right: AI Assessment + Decision */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>AI Assessment</CardTitle>
              <TierBadge tier={MOCK_AI.tier_recommendation} />
            </div>
            <div className="p-3 bg-primary-50 rounded-lg mb-4">
              <p className="text-sm font-medium text-primary-700">
                Recommended: Accelerate {MOCK_AI.tier_recommendation.charAt(0).toUpperCase() + MOCK_AI.tier_recommendation.slice(1)}
              </p>
            </div>
            <div className="mb-4 flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Market Size</h4>
                <p className="text-sm text-gray-600">{MOCK_AI.market_size}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <UsersIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Jobs Impact</h4>
                <p className="text-sm text-gray-600">
                  +{MOCK_AI.jobs_impact.creative} creative = <span className="font-semibold text-green-600">+{MOCK_AI.jobs_impact.net} net jobs</span>
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-gray-900">Top 5 Risks</h3>
            </div>
            <ol className="space-y-2">
              {MOCK_AI.failure_reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 font-medium min-w-[1.25rem]">{i + 1}.</span>{r}
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-gray-900">Top 5 Opportunities</h3>
            </div>
            <ol className="space-y-2">
              {MOCK_AI.opportunity_reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 font-medium min-w-[1.25rem]">{i + 1}.</span>{r}
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Probing Questions</h3>
            </div>
            <ol className="space-y-2">
              {MOCK_AI.probing_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-400 font-medium min-w-[1.25rem]">{i + 1}.</span>{q}
                </li>
              ))}
            </ol>
          </Card>

          {existingReview ? (
            <Card>
              <CardTitle>Decision Made</CardTitle>
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-700">
                  Triaged as: {existingReview.triage_outcome?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
                {existingReview.decision_notes && (
                  <p className="text-sm text-gray-600 mt-1">{existingReview.decision_notes}</p>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <CardTitle>Triage Decision</CardTitle>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {([
                  { value: 'self_serve', label: 'Continue Self-Serve', color: 'border-gray-300 bg-gray-50 text-gray-700' },
                  { value: 'prime', label: 'Accelerate Prime', color: 'border-purple-300 bg-purple-50 text-purple-700' },
                  { value: 'core', label: 'Accelerate Core', color: 'border-blue-300 bg-blue-50 text-blue-700' },
                  { value: 'select', label: 'Accelerate Select', color: 'border-amber-300 bg-amber-50 text-amber-700' },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedOutcome(option.value)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedOutcome === option.value
                        ? `${option.color} ring-2 ring-offset-1 ring-primary-300`
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Textarea
                  label="Decision Notes"
                  placeholder="Add any notes about your decision..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button
                className="w-full mt-4"
                size="lg"
                disabled={!selectedOutcome}
                loading={submitting}
                onClick={handleSubmitDecision}
                icon={<Target className="w-4 h-4" />}
              >
                Submit Decision
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
