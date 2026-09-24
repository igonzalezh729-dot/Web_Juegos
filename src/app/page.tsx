'use client';

import { useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { JoinForm } from '@/components/room/JoinForm';

export default function Home() {
  const router = useRouter();
  const { createRoom, joinRoom, isConnected, error } = useRoom();

  const handleCreateRoom = async (name: string) => {
    try {
      const roomCode = await createRoom(name);
      router.push(`/host/${roomCode}`);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleJoinRoom = async (roomCode: string, name: string) => {
    try {
      await joinRoom(roomCode, name);
      router.push(`/controller/${roomCode.toUpperCase()}`);
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-indigo-950">
      <div className="w-full max-w-md">
        <JoinForm
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          isConnected={isConnected}
          error={error}
        />
      </div>
    </div>
  );
}
