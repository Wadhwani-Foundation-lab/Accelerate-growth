import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Input';
import { Card } from '../common/Card';
import type { UserRole } from '../../types';

const TEAM_ROLES: { value: UserRole; label: string }[] = [
  { value: 'venture_partner', label: 'Venture Partner' },
  { value: 'mentor', label: 'Mentor / Advisor' },
  { value: 'success_manager', label: 'Customer Success Manager' },
  { value: 'field_head', label: 'Field Head' },
  { value: 'selection_manager', label: 'Central Selection Manager' },
  { value: 'selection_committee', label: 'Selection Committee' },
  { value: 'super_admin', label: 'Super Admin' },
];

export function SignupPage() {
  const [searchParams] = useSearchParams();
  const isTeam = searchParams.get('type') === 'team';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>(isTeam ? 'venture_partner' : 'entrepreneur');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, {
        full_name: fullName,
        role: isTeam ? role : 'entrepreneur',
        organization: organization || undefined,
        phone: phone || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
        <Card className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-500 mb-6">
            Please check your email to verify your account, then sign in.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Go to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">
            {isTeam ? 'Team Member Registration' : 'Entrepreneur Registration'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Organization"
              placeholder="Your company or organization name"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />

            {isTeam && (
              <Select
                label="Role"
                options={TEAM_ROLES}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                required
              />
            )}

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
