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

// Mock data for demonstration
const MOCK_APPLICATION = {
  id: '1',
  entrepreneur_name: 'Rajesh Kumar',
  organization: 'Punjab Sports Manufacturing',
  current_product: 'Soccer balls',
  current_segment: 'School students',
  current_geography: 'Punjab',
  current_business_model: 'Direct sales',
  venture_product: 'Cricket equipment',
  venture_segment: '',
  venture_geography: 'Germany',
  venture_business_model: '',
  venture_description: 'Expanding soccer ball manufacturing to include cricket equipment and entering the German market for sports goods export.',
  expected_revenue_range: '10cr',
  progress_so_far: 'Completed market research for German market. Built prototype cricket bats. Hired export consultant.',
  investment_willingness: '1cr',
  resource_allocation: 'Dedicated export manager, 5 production staff for new line',
  source: 'csm_referral' as const,
  streams: [
    { name: 'Capital & Funding', status: 'on_it', support_type: '' },
    { name: 'Product / Service', status: 'done', support_type: '' },
    { name: 'People & Talent', status: 'on_it', support_type: '' },
    { name: 'Operations & Supply Chain', status: 'need_help', support_type: 'connect' },
    { name: 'Go-to-Market (GTM)', status: 'need_help', support_type: 'learn' },
    { name: 'Procurement & Infrastructure', status: 'done', support_type: '' },
  ],
};

const MOCK_AI_ASSESSMENT = {
  tier_recommendation: 'core' as const,
  failure_reasons: [
    'German market has strict quality certifications (DIN standards) that may take 12+ months',
    'Limited export experience - no existing distribution network in Europe',
    'Cricket equipment is a competitive market with established brands',
    'Single product line dependency may limit market penetration',
    'Currency risk and working capital needs for international trade',
  ],
  opportunity_reasons: [
    'Strong manufacturing base and competitive pricing from India',
    'Growing sports goods demand in Germany - €3.2B market',
    'Government export incentives available for SMEs',
    'Existing quality systems can be adapted for DIN certification',
    'Personal network through export consultant already in place',
  ],
  probing_questions: [
    'Have you identified specific distribution partners or agents in Germany?',
    'What is your DIN certification timeline and which specific certifications are needed?',
    'How will you manage quality control for the new cricket equipment line?',
    'What is your pricing strategy relative to established brands like SG and MRF?',
    'Have you secured any letters of intent or pre-orders from German buyers?',
  ],
  market_size: 'German sports goods market: €3.2B (2025). Cricket niche estimated at €50M with 8% annual growth.',
  jobs_impact: {
    creative: 25,
    destructive: 0,
    net: 25,
    description: 'New production line + export operations expected to create 25 new jobs',
  },
};

export function ApplicationReview() {
  const { ventureId } = useParams();
  const navigate = useNavigate();
  const [selectedOutcome, setSelectedOutcome] = useState<TriageOutcome | ''>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const app = MOCK_APPLICATION;
  const ai = MOCK_AI_ASSESSMENT;

  async function handleSubmitDecision() {
    if (!selectedOutcome) return;
    setSubmitting(true);
    // API call would go here
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    navigate('/csm/applications');
  }

  const sourceLabels: Record<string, string> = {
    self_initiated: 'Self-Initiated',
    platform_nudge: 'Platform Nudge',
    csm_referral: 'CSM Referral',
    ecosystem_referral: 'Ecosystem Referral',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-white/50">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
          <p className="text-gray-500 text-sm">Venture ID: {ventureId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Application Summary */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Application Summary</CardTitle>
              <Badge variant="primary">{sourceLabels[app.source]}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Applicant</h4>
                <p className="font-semibold text-gray-900">{app.entrepreneur_name}</p>
                <p className="text-sm text-gray-600">{app.organization}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Current</p>
                  <p className="text-sm font-medium">{app.current_product}</p>
                  <p className="text-xs text-gray-500">{app.current_segment} / {app.current_geography}</p>
                </div>
                <div className="bg-primary-50 p-3 rounded-lg">
                  <p className="text-xs text-primary-600 mb-0.5">Venture (New)</p>
                  <p className="text-sm font-medium">{app.venture_product || '—'}</p>
                  <p className="text-xs text-gray-500">{app.venture_geography || '—'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Venture Description</h4>
                <p className="text-sm text-gray-700">{app.venture_description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Expected Revenue (Yr 3)</h4>
                  <p className="text-lg font-bold text-primary-600">₹10 Crore</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Willing to Invest</h4>
                  <p className="text-lg font-bold text-gray-900">₹1 Crore</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Commitment Details */}
          <Card>
            <CardTitle>Commitment</CardTitle>
            <div className="mt-3 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Progress So Far</h4>
                <p className="text-sm text-gray-700 mt-1">{app.progress_so_far}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Resource Allocation</h4>
                <p className="text-sm text-gray-700 mt-1">{app.resource_allocation}</p>
              </div>
            </div>
          </Card>

          {/* Stream Assessment */}
          <Card>
            <CardTitle>Support Needs</CardTitle>
            <div className="mt-3 space-y-2">
              {app.streams.map((stream) => (
                <div key={stream.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{stream.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        stream.status === 'done' ? 'success' :
                        stream.status === 'on_it' ? 'info' : 'warning'
                      }
                    >
                      {stream.status === 'done' ? 'Done' : stream.status === 'on_it' ? 'On It' : 'Need Help'}
                    </Badge>
                    {stream.support_type && (
                      <Badge variant="primary">{stream.support_type}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: AI Assessment */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>AI Assessment</CardTitle>
              <TierBadge tier={ai.tier_recommendation} />
            </div>

            <div className="p-3 bg-primary-50 rounded-lg mb-4">
              <p className="text-sm font-medium text-primary-700">
                Recommended: Accelerate {ai.tier_recommendation.charAt(0).toUpperCase() + ai.tier_recommendation.slice(1)}
              </p>
            </div>

            {/* Market Size */}
            <div className="mb-4 flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Market Size</h4>
                <p className="text-sm text-gray-600">{ai.market_size}</p>
              </div>
            </div>

            {/* Jobs Impact */}
            <div className="mb-4 flex items-start gap-2">
              <UsersIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Jobs Impact</h4>
                <p className="text-sm text-gray-600">
                  +{ai.jobs_impact.creative} creative, {ai.jobs_impact.destructive} destructive = <span className="font-semibold text-green-600">+{ai.jobs_impact.net} net jobs</span>
                </p>
                <p className="text-xs text-gray-500">{ai.jobs_impact.description}</p>
              </div>
            </div>
          </Card>

          {/* Failure Reasons */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h3 className="font-semibold text-gray-900">Top 5 Risks</h3>
            </div>
            <ol className="space-y-2">
              {ai.failure_reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-red-400 font-medium min-w-[1.25rem]">{i + 1}.</span>
                  {reason}
                </li>
              ))}
            </ol>
          </Card>

          {/* Opportunity Reasons */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-gray-900">Top 5 Opportunities</h3>
            </div>
            <ol className="space-y-2">
              {ai.opportunity_reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 font-medium min-w-[1.25rem]">{i + 1}.</span>
                  {reason}
                </li>
              ))}
            </ol>
          </Card>

          {/* Probing Questions */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Probing Questions</h3>
            </div>
            <ol className="space-y-2">
              {ai.probing_questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-400 font-medium min-w-[1.25rem]">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ol>
          </Card>

          {/* Triage Decision */}
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
        </div>
      </div>
    </div>
  );
}
