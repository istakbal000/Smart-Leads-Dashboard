import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/leads?limit=1000');
      const leads = response.data.leads;
      
      const stats = {
        total: leads.length,
        qualified: leads.filter((l: any) => l.status === 'Qualified').length,
        new: leads.filter((l: any) => l.status === 'New').length,
        contacted: leads.filter((l: any) => l.status === 'Contacted').length,
      };

      return { stats, recentLeads: leads.slice(0, 5) };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads', value: data?.stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Qualified', value: data?.stats.qualified, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'New Leads', value: data?.stats.new, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Contacted', value: data?.stats.contacted, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}!</h1>
        <p className="text-slate-600 dark:text-slate-400">Here's what's happening with your leads today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {data?.recentLeads.map((lead: any) => (
              <div key={lead._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold mr-4">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.source} • {new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  lead.status === 'Qualified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
            <TrendingUp className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Performance Tracking</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Your lead conversion rate is up by 12% this week! Keep up the great work.</p>
          <Link 
            to="/app/analytics"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors inline-block"
          >
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
