'use client'
import React, { useEffect, useState } from 'react'
import useIsMobile from '../hooks/useMobile';
import useAuthStore from '../store/useAuthStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { Spin } from 'antd';

const Page = () => {
  const isMobile = useIsMobile();
  const [currUser, setCurrUser] = useState<any>(null);
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('googleIdToken');
    if (!isLoggedIn && token) {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        useAuthStore.setState({
          isLoggedIn: true,
          user: JSON.parse(storedUser),
        });
      }
    } else if (!token) {
      router.push('/');
    }
  }, []);

  if (isMobile) {
    return (
      <div className="h-screen flex items-center px-10 justify-center bg-black text-white text-xl">
        Please switch to a desktop device for the best experience.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center px-10 justify-center text-xl">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col px-10 text-xl overflow-hidden relative">
      <div className="absolute top-4 right-6">
        {user?.avatarUrl ? (
          <button onClick={() => router.push('/profile')}>
            <Image
              className="rounded-full cursor-pointer hover:opacity-80 transition"
              src={user.avatarUrl}
              width={50}
              height={50}
              alt={user.name ? `${user.name}'s avatar` : 'User avatar'}
            />
          </button>
        ) : (
          <button
            onClick={() => router.push('/profile')}
            className="w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:opacity-80 transition"
          >
            <span className="text-gray-500 text-xs">No Avatar</span>
          </button>
        )}
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center mt-10 gap-7 mb-4 w-full">
        <TextShimmer
          duration={1.2}
          className="
            h-20
            w-[50%]
            left-6
            text-4xl text-center font-medium
            [--base-color:theme(colors.violet.500)]
            [--base-gradient-color:theme(colors.blue.200)]
            dark:[--base-color:theme(colors.blue.700)]
            dark:[--base-gradient-color:theme(colors.blue.400)]
          "
        >
          Customer Relationship Management Application
        </TextShimmer>
      </div>
    </div>
  );
};

export default Page;
