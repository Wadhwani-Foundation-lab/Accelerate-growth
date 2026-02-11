import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Info, Banknote, Package, Users, Settings, TrendingUp, Building } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Stepper } from '../common/Stepper';
import { Modal } from '../common/Modal';
import { STREAM_DEFINITIONS, type StreamSelfStatus, type SupportType, type ApplicationSource } from '../../types';

const STEPS = ['Venture Definition', 'Commitment', 'Support Needs'];

const STREAM_ICONS: Record<string, React.ReactNode> = {
  Banknote: <Banknote className="w-6 h-6" />,
  Package: <Package className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Settings: <Settings className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Building: <Building className="w-6 h-6" />,
};

interface StreamAssessment {
  stream_number: number;
  stream_name: string;
  self_status: StreamSelfStatus | '';
  support_type: SupportType | '';
  support_type_other: string;
}

const SOURCE_OPTIONS: { value: ApplicationSource; label: string; description: string }[] = [
  { value: 'self_initiated', label: 'Self-Initiated', description: 'I found and applied on my own' },
  { value: 'platform_nudge', label: 'Platform Suggestion', description: 'The platform suggested I apply' },
  { value: 'csm_referral', label: 'Success Manager Referral', description: 'A Customer Success Manager referred me' },
  { value: 'ecosystem_referral', label: 'Ecosystem Referral', description: 'Referred by another beneficiary or partner' },
];

export function SupportNeeds() {
  const navigate = useNavigate();
  const [streams, setStreams] = useState<StreamAssessment[]>(
    STREAM_DEFINITIONS.map((s) => ({
      stream_number: s.number,
      stream_name: s.name,
      self_status: '',
      support_type: '',
      support_type_other: '',
    }))
  );
  const [source, setSource] = useState<ApplicationSource | ''>('');
  const [infoStream, setInfoStream] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const step1 = sessionStorage.getItem('application_step1');
    const step2 = sessionStorage.getItem('application_step2');
    if (!step1 || !step2) {
      navigate('/apply/step-1');
    }
  }, [navigate]);

  const needHelpCount = streams.filter((s) => s.self_status === 'need_help').length;

  function updateStream(index: number, field: keyof StreamAssessment, value: string) {
    setStreams((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      // Reset support type if not "need_help"
      if (field === 'self_status' && value !== 'need_help') {
        next[index].support_type = '';
        next[index].support_type_other = '';
      }
      return next;
    });
  }

  function canSelectNeedHelp(index: number): boolean {
    if (streams[index].self_status === 'need_help') return true;
    return needHelpCount < 3;
  }

  async function handleSubmit() {
    setSubmitting(true);
    // In production, this would POST to the API
    // For now, store in sessionStorage and show success
    const step1 = JSON.parse(sessionStorage.getItem('application_step1') || '{}');
    const step2 = JSON.parse(sessionStorage.getItem('application_step2') || '{}');

    const application = {
      ...step1,
      ...step2,
      streams,
      source,
    };

    console.log('Application submitted:', application);
    sessionStorage.setItem('application_complete', JSON.stringify(application));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Thank you for applying to the Accelerate program. We'll review your application and get back to you soon.
          </p>
          <Button className="mt-6" onClick={() => navigate('/my-venture')}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Stepper steps={STEPS} currentStep={2} />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Where Do You Need Help?</h1>
        <p className="text-gray-500 mt-1">
          Assess each execution stream. You can select up to 3 areas where you need help.
        </p>
      </div>

      {/* Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {STREAM_DEFINITIONS.map((streamDef, index) => {
          const stream = streams[index];
          return (
            <Card key={streamDef.number} padding="sm" className="relative">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                  {STREAM_ICONS[streamDef.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-gray-900 text-sm">{streamDef.name}</h3>
                    <button
                      onClick={() => setInfoStream(streamDef.number)}
                      className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-500"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{streamDef.description}</p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex gap-1.5 mb-2">
                {(['done', 'on_it', 'need_help'] as StreamSelfStatus[]).map((status) => {
                  const labels = { done: 'Done', on_it: 'On It', need_help: 'Need Help' };
                  const isDisabled = status === 'need_help' && !canSelectNeedHelp(index);
                  return (
                    <button
                      key={status}
                      disabled={isDisabled}
                      onClick={() => updateStream(index, 'self_status', status)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        stream.self_status === status
                          ? status === 'done'
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : status === 'on_it'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-orange-50 border-orange-500 text-orange-700'
                          : isDisabled
                          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {labels[status]}
                    </button>
                  );
                })}
              </div>

              {/* Support Type (if Need Help) */}
              {stream.self_status === 'need_help' && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-600 mb-1.5">What type of help?</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(['learn', 'connect', 'do', 'other'] as SupportType[]).map((type) => {
                      const labels = { learn: 'Learn', connect: 'Connect', do: 'Do', other: 'Other' };
                      const descriptions = {
                        learn: 'Teach me',
                        connect: 'Connect me',
                        do: 'Do it for me',
                        other: 'Something else',
                      };
                      return (
                        <button
                          key={type}
                          onClick={() => updateStream(index, 'support_type', type)}
                          className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                            stream.support_type === type
                              ? 'bg-primary-50 border-primary-500 text-primary-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                          title={descriptions[type]}
                        >
                          {labels[type]}
                        </button>
                      );
                    })}
                  </div>
                  {stream.support_type === 'other' && (
                    <input
                      className="mt-2 w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                      placeholder="Describe what help you need..."
                      value={stream.support_type_other}
                      onChange={(e) => updateStream(index, 'support_type_other', e.target.value)}
                    />
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Help count indicator */}
      {needHelpCount > 0 && (
        <p className="text-sm text-gray-500 mb-4">
          Help requested: <span className="font-medium text-primary-600">{needHelpCount}/3</span> streams
        </p>
      )}

      {/* Application Source */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">How did you find us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SOURCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSource(opt.value)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                source === opt.value
                  ? 'bg-primary-50 border-primary-500'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-sm font-medium ${source === opt.value ? 'text-primary-700' : 'text-gray-700'}`}>
                {opt.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/apply/step-2')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          size="lg"
          loading={submitting}
          icon={<Send className="w-4 h-4" />}
        >
          Submit Application
        </Button>
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={infoStream !== null}
        onClose={() => setInfoStream(null)}
        title={STREAM_DEFINITIONS.find((s) => s.number === infoStream)?.name || ''}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">End Deliverable</h4>
            <p className="text-sm text-gray-600">
              {STREAM_DEFINITIONS.find((s) => s.number === infoStream)?.description}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Checkpoints</h4>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {i}
                  </span>
                  <p className="text-sm text-gray-600">
                    AI-generated checkpoint {i} specific to your venture context will appear here.
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 italic">
            These checkpoints will be AI-generated based on your specific venture details after submission.
          </p>
        </div>
      </Modal>
    </div>
  );
}
