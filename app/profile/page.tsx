'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/useAuthStore';
import { Button, Input } from 'antd';
import { EditOutlined, LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const ProfilePage = () => {
  const { user, login, logout } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    createdAt: user?.createdAt ? new Date(user.createdAt).toDateString() : '',
  });
  type EditableField = 'email' | 'name';
  const [editable, setEditable] = useState({
    email: false,
    name: false,
  });

  const [loading, setLoading] = useState(false);

  const enableEdit = (field: string) => {
    setEditable((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field: EditableField) => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user._id,
          field,
          value: formData[field]
        }),
      });

      if (!res.ok) throw new Error('Update failed');
      await res.json();

      setEditable((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  if (!user) return <div className="flex h-screen justify-center items-center">Loading...</div>;

  return (
    <div className="h-screen flex flex-col px-10 py-6">
      {/* Back Button */}
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/dashboard')}
        className="w-fit mb-6 ml-30"
      >
        Back to Dashboard
      </Button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-10 ml-30 mt-4">PROFILE</h1>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <Image
          src={user.avatarUrl}
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full border shadow-md"
        />
      </div>

      {/* Profile Form */}
      <div className="max-w-md mx-auto w-full flex flex-col gap-6">
        {/* Email */}
        <div className="flex items-center gap-2">
          <Input
            value={formData.email}
            disabled={!editable.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Button
            type={editable.email ? 'primary' : 'default'}
            className={editable.email ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
            icon={<EditOutlined />}
            loading={loading}
            onClick={() => {
              editable.email ? handleSave('email') : enableEdit('email');
            }}
          >
            {editable.email ? 'Save' : 'Edit'}
          </Button>
        </div>

        {/* Name */}
        <div className="flex items-center gap-2">
          <Input
            value={formData.name}
            disabled={!editable.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <Button
            type={editable.name ? 'primary' : 'default'}
            className={editable.name ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
            icon={<EditOutlined />}
            loading={loading}
            onClick={() => {
              editable.name ? handleSave('name') : enableEdit('name');
            }}
          >
            {editable.name ? 'Save' : 'Edit'}
          </Button>
        </div>

        {/* Joined Since */}
        <Input value={`Joined since: ${formData.createdAt}`} disabled />

        {/* Signout */}
        <Button
          danger
          icon={<LogoutOutlined />}
          className="mt-6 bg-red-500 text-white hover:bg-red-600"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
