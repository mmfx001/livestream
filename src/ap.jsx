import React, { useState } from 'react';
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  useCall,
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";

const apiKey = "mmhfdzb5evj2";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0x1a2VfU2t5d2Fsa2VyIiwidXNlcl9pZCI6Ikx1a2VfU2t5d2Fsa2VyIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3MzA0NzAyNjYsImV4cCI6MTczMTA3NTA2Nn0.umjhtbOVpZ4mc9yJ1ua7aTEmWuNIqtDIKnUqtLeCeHU";
const userId = "Luke_Skywalker";
const callId = "66NYgpA1xtGF";

const user = { id: userId, name: "Tutorial" };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("livestream", callId);
call.join({ create: true });

export default function App() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyLivestreamUI />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyLivestreamUI = () => {
  const call = useCall();
  const { useIsCallLive, useLocalParticipant, useParticipantCount } = useCallStateHooks();

  const totalParticipants = useParticipantCount();
  const localParticipant = useLocalParticipant();
  const isCallLive = useIsCallLive();
  
  // State to hold roomId
  const [roomId, setRoomId] = useState('');

  const startLive = async () => {
    const startTime = new Date().toISOString();
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const liveData = {
      email: loggedInUser?.email || "sabina", // default email
      username: loggedInUser?.name || "No name", // default username
      startTime: startTime,
      videoTitle: "Jonli Efir",
      status: "started",
      chat: [],
    };

    try {
      const response = await fetch('https://livetest-jgle.onrender.com/live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(liveData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }

      // Get the live stream data from the response
      const createdStream = await response.json();

      // Set roomId from the created stream
      setRoomId(createdStream.roomId);
      console.log(roomId);
      
      console.log('Live data posted successfully', createdStream);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
    }

    call.goLive();
  };

  const stopLive = async () => {
    // Use roomId from state
    console.log('Attempting to delete room:', roomId);

    if (!roomId) {
      console.error('No roomId available to delete');
      return;
    }

    try {
      const response = await fetch(`https://livetest-jgle.onrender.com/live/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Network response was not ok: ${errorResponse.message}`);
      }

      console.log('Live data deleted successfully');
      call.stopLive(); // Stop the live call
      setRoomId(''); // Clear the roomId after stopping
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-2xl font-bold text-white mb-4">
        Live: {totalParticipants}
      </div>
      <div className="mb-5 w-full rounded-lg overflow-hidden border-2 border-white bg-white shadow-lg">
        {localParticipant && (
          <ParticipantView
            participant={localParticipant}
            ParticipantViewUI={null} />
        )}
      </div>
      <div className="flex justify-center w-full mt-4">
        {isCallLive ? (
          <button
            onClick={stopLive}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500 transition duration-200">
            Stop Live
          </button>
        ) : (
          <button
            onClick={startLive}
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-500 transition duration-200">
            Start Live
          </button>
        )}
      </div>
    </div>
  );
};
