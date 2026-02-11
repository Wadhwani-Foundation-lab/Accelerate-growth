import { Users, Briefcase, BarChart3, Settings } from 'lucide-react';
import { Card, CardTitle } from '../common/Card';
import { Badge } from '../common/Badge';

export function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">48</p>
              <p className="text-xs text-gray-500">Total Ventures</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">124</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">312</p>
              <p className="text-xs text-gray-500">Jobs Created</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">6</p>
              <p className="text-xs text-gray-500">Active Streams</p>
            </div>
          </div>
        </Card>
      </div>

      {/* User Management */}
      <Card className="mb-6">
        <CardTitle>User Management</CardTitle>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 pb-2">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2">Organization</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Arun Goel', role: 'Venture Partner', org: 'Foundation', status: 'Active' },
                { name: 'Niju Prabha', role: 'Success Manager', org: 'Foundation', status: 'Active' },
                { name: 'Rajesh Kumar', role: 'Entrepreneur', org: 'Punjab Sports', status: 'Active' },
                { name: 'Priya Mehta', role: 'Entrepreneur', org: 'Spice Exports', status: 'Active' },
                { name: 'Dr. Sunita', role: 'Mentor', org: 'External', status: 'Active' },
              ].map((user, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="py-3"><Badge>{user.role}</Badge></td>
                  <td className="py-3 text-sm text-gray-600">{user.org}</td>
                  <td className="py-3"><Badge variant="success">{user.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tier Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-purple-700">22</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Prime</p>
            <p className="text-xs text-gray-500">Entry-level support</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-blue-700">18</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Core</p>
            <p className="text-xs text-gray-500">Mid-level support</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-amber-700">8</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Select</p>
            <p className="text-xs text-gray-500">Premium support</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
