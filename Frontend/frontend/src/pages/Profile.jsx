import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Lock } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <p className="text-blue-100 mt-1">Manage your account information and security</p>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
                <p className="text-gray-900 font-semibold">{user?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                <p className="text-gray-900 font-semibold">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield size={18} className="text-green-600" />
              <span className="text-sm font-medium">Account status: Secure (HTTP-only Cookie Session)</span>
            </div>
            <Link
              to="/change-password"
              className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Lock size={16} />
              <span>Change Password</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};