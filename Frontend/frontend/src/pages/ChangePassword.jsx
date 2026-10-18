import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { FormInput } from '../components/FormInput';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ChangePassword = () => {
  const [formData, setFormData] = useState({ password: '', new_password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Submit only password and new_password expected by the backend
      await authApi.changePassword({
        password: formData.password,
        new_password: formData.new_password,
      });
      setSuccess('Password updated successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link to="/profile" className="inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </Link>

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            <p className="text-xs text-gray-500">Ensure your account is using a secure password</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput label="Current Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          <FormInput label="New Password" type="password" name="new_password" value={formData.new_password} onChange={handleChange} placeholder="••••••••" />
          <FormInput label="Confirm New Password" type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};