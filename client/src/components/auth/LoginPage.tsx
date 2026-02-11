import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';

type LoginMode = 'select' | 'login';

export function LoginPage() {
  const [mode, setMode] = useState<LoginMode>('select');
  const [userType, setUserType] = useState<'entrepreneur' | 'team'>('entrepreneur');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  if (mode === 'select') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Accelerate</h1>
            <p className="text-gray-500 mt-1">Assisted Venture Growth Platform</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Card
              hover
              className={`cursor-pointer transition-all ${
                userType === 'entrepreneur' ? 'ring-2 ring-primary-500 bg-primary-50/50' : ''
              }`}
              onClick={() => setUserType('entrepreneur')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">I am an Entrepreneur</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Apply for the growth program or manage your venture</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  userType === 'entrepreneur' ? 'border-primary-500' : 'border-gray-300'
                }`}>
                  {userType === 'entrepreneur' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                </div>
              </div>
            </Card>

            <Card
              hover
              className={`cursor-pointer transition-all ${
                userType === 'team' ? 'ring-2 ring-primary-500 bg-primary-50/50' : ''
              }`}
              onClick={() => setUserType('team')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">I am a Team Member</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Venture Partner, Mentor, Success Manager, or Admin</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  userType === 'team' ? 'border-primary-500' : 'border-gray-300'
                }`}>
                  {userType === 'team' && <div className="w-3 h-3 rounded-full bg-primary-500" />}
                </div>
              </div>
            </Card>
          </div>

          <Button
            className="w-full mt-6"
            size="lg"
            onClick={() => setMode('login')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to={`/signup?type=${userType}`} className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-500 mt-1">
            {userType === 'entrepreneur' ? 'Entrepreneur Login' : 'Team Member Login'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>
        </Card>

        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            onClick={() => setMode('select')}
            className="text-gray-500 hover:text-gray-700"
          >
            Back to role selection
          </button>
          <Link to={`/signup?type=${userType}`} className="text-primary-600 hover:text-primary-700 font-medium">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
