import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Stepper } from '../common/Stepper';
import { REVENUE_RANGES } from '../../types';

const STEPS = ['Venture Definition', 'Commitment', 'Support Needs'];

interface VentureData {
  current_product: string;
  current_segment: string;
  current_geography: string;
  current_business_model: string;
  venture_product: string;
  venture_segment: string;
  venture_geography: string;
  venture_business_model: string;
  venture_description: string;
  expected_revenue_range: string;
}

export function VentureDefinition() {
  const navigate = useNavigate();
  const [showExitMessage, setShowExitMessage] = useState(false);
  const [data, setData] = useState<VentureData>({
    current_product: '',
    current_segment: '',
    current_geography: '',
    current_business_model: '',
    venture_product: '',
    venture_segment: '',
    venture_geography: '',
    venture_business_model: '',
    venture_description: '',
    expected_revenue_range: '',
  });

  function updateField(field: keyof VentureData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    setShowExitMessage(false);
  }

  function hasVentureChange(): boolean {
    return !!(
      data.venture_product.trim() ||
      data.venture_segment.trim() ||
      data.venture_geography.trim() ||
      data.venture_business_model.trim()
    );
  }

  function handleNext() {
    if (!hasVentureChange()) {
      setShowExitMessage(true);
      return;
    }
    // Store in sessionStorage for multi-step form
    sessionStorage.setItem('application_step1', JSON.stringify(data));
    navigate('/apply/step-2');
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Stepper steps={STEPS} currentStep={0} />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Define Your Venture</h1>
        <p className="text-gray-500 mt-1">Tell us about your current business and the growth venture you're pursuing.</p>
      </div>

      {/* Current Business */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Current Business</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product / Service"
            placeholder="e.g., Soccer balls"
            value={data.current_product}
            onChange={(e) => updateField('current_product', e.target.value)}
            required
          />
          <Input
            label="Customer Segment"
            placeholder="e.g., School students"
            value={data.current_segment}
            onChange={(e) => updateField('current_segment', e.target.value)}
            required
          />
          <Input
            label="Geography / Market"
            placeholder="e.g., Punjab"
            value={data.current_geography}
            onChange={(e) => updateField('current_geography', e.target.value)}
            required
          />
          <Input
            label="Business Model / Channel"
            placeholder="e.g., Direct sales"
            value={data.current_business_model}
            onChange={(e) => updateField('current_business_model', e.target.value)}
            required
          />
        </div>
      </Card>

      {/* Growth Venture */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Your Growth Venture</h2>
        <p className="text-sm text-gray-500 mb-4">
          What's changing? At least one dimension must be different from your current business.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="New Product / Service"
            placeholder="Leave blank if same"
            value={data.venture_product}
            onChange={(e) => updateField('venture_product', e.target.value)}
            helperText="What new product or service?"
          />
          <Input
            label="New Customer Segment"
            placeholder="Leave blank if same"
            value={data.venture_segment}
            onChange={(e) => updateField('venture_segment', e.target.value)}
            helperText="What new customer segment?"
          />
          <Input
            label="New Geography / Market"
            placeholder="Leave blank if same"
            value={data.venture_geography}
            onChange={(e) => updateField('venture_geography', e.target.value)}
            helperText="What new geographic market?"
          />
          <Input
            label="New Business Model / Channel"
            placeholder="Leave blank if same"
            value={data.venture_business_model}
            onChange={(e) => updateField('venture_business_model', e.target.value)}
            helperText="What new business model?"
          />
        </div>

        <div className="mt-4">
          <Textarea
            label="Describe Your Venture"
            placeholder="Briefly describe what your growth venture is about..."
            value={data.venture_description}
            onChange={(e) => updateField('venture_description', e.target.value)}
          />
        </div>
      </Card>

      {/* Expected Revenue */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Expected Revenue</h2>
        <p className="text-sm text-gray-500 mb-4">
          What incremental run-rate revenue do you expect from this venture by Year 3?
        </p>
        <div className="flex flex-wrap gap-2">
          {REVENUE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => updateField('expected_revenue_range', range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                data.expected_revenue_range === range.value
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Exit Message */}
      {showExitMessage && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              It looks like you haven't defined a growth venture yet.
            </p>
            <p className="text-sm text-amber-700 mt-1">
              At least one dimension (product, segment, geography, or business model) must change from your current business. We recommend our seminar on <span className="font-medium">How to Define a Venture</span>.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={handleNext} size="lg" icon={<ArrowRight className="w-4 h-4" />}>
          Next: Commitment
        </Button>
      </div>
    </div>
  );
}
