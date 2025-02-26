import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Clock, AlertCircle } from 'lucide-react';

const UserUtilizationStats = ({ data }) => {
  
  const activeUsers = data.filter(user => user.totalHours > 0).length;
  const avgUtilization = data.reduce((acc, user) => acc + user.utilizationPercentage, 0) / data.length;
  const maxUtilization = Math.max(...data.map(user => user.utilizationPercentage));

  
  const chartData = data.map(user => ({
    name: user.username,
    utilization: Math.round(user.utilizationPercentage),
    hours: user.totalHours
  }));

  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <h3 className="text-sm font-medium">Active Users</h3>
          </div>
          <p className="mt-2 text-2xl font-semibold">{activeUsers} / {data.length}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <h3 className="text-sm font-medium">Average Utilization</h3>
          </div>
          <p className="mt-2 text-2xl font-semibold">{Math.round(avgUtilization)}%</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-sm font-medium">Peak Utilization</h3>
          </div>
          <p className="mt-2 text-2xl font-semibold">{Math.round(maxUtilization)}%</p>
        </div>
      </div>


      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Utilization by User</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Starting</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{user.totalHours}h</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, user.utilizationPercentage)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{Math.round(user.utilizationPercentage)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{user.weekStartDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserUtilizationStats;