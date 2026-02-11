import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card } from '../common/Card';
import { Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Stepper } from '../common/Stepper';
import { INVESTMENT_RANGES } from '../../types';

const STEPS = ['Venture Definition', 'Commitment', 'Support Needs'];

interface CommitmentData {
  progress_so_far: string;
  investment_willingness: string;
  resource_allocation: string;
}

export function CommitmentAssessment() {
  const navigate = useNavigate();
  const [data, setData] = useState<CommitmentData>({
    progress_so_far: '',
    investment_willingness: '',
    resource_allocation: '',
  });

  useEffect(() => {
    // Check if step 1 data exists
    const step1 = sessionStorage.getItem('application_step1');
    if (!step1) {
      navigate('/apply/step-1');
    }
  }, [navigate]);

  function updateField(field: keyof CommitmentData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    sessionStorage.setItem('application_step2', JSON.stringify(data));
    navigate('/apply/step-3');
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Stepper steps={STEPS} currentStep={1} />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Demonstrate Your Commitment</h1>
        <p className="text-gray-500 mt-1">Help us understand how committed you are to pursuing this venture.</p>
      </div>

      {/* Progress So Far */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">What progress have you made so far?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Describe any concrete steps you've taken toward your venture (e.g., engaged a consultant, did a pilot, assigned a team member, built a prototype).
        </p>
        <Textarea
          placeholder="e.g., We've done a pilot run with 50 units, hired a dedicated manager for this project, and completed initial market research..."
          value={data.progress_so_far}
          onChange={(e) => updateField('progress_so_far', e.target.value)}
          required
        />
      </Card>

      {/* Investment Willingness */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">How much are you willing to invest?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Not how much you need, but how much you're willing to put into this venture from your own resources.
        </p>
        <div className="flex flex-wrap gap-2">
          {INVESTMENT_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => updateField('investment_willingness', range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                data.investment_willingness === range.value
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Resource Allocation */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">What resources (people) will you allocate?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Describe the people resources you're willing to dedicate to this venture.
        </p>
        <Textarea
          placeholder="e.g., Dedicated project manager, 5 existing team members reallocated, planning to hire 10 new people..."
          value={data.resource_allocation}
          onChange={(e) => updateField('resource_allocation', e.target.value)}
          required
        />
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/apply/step-1')} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button onClick={handleNext} size="lg" icon={<ArrowRight className="w-4 h-4" />}>
          Next: Support Needs
        </Button>
      </div>
    </div>
  );
}
