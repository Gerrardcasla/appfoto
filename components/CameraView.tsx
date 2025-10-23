
import React, { useRef, useEffect, useState, useCallback } from 'react';
import CameraIcon from './icons/CameraIcon';

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions and try again.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(dataUrl);
    }
  };

  return (
    <div className="relative p-4 md:p-6 bg-black rounded-lg shadow-2xl flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
      {error && (
        <div className="text-red-400 bg-red-900/50 p-4 rounded-lg text-center">
            <p>{error}</p>
            <button onClick={startCamera} className="mt-4 px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600">
                Retry
            </button>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-auto max-h-[50vh] rounded-md transition-opacity duration-500 ${!stream || error ? 'opacity-0' : 'opacity-100'}`}
        style={{ transform: 'scaleX(-1)' }} // Mirror view for user-facing camera
      />
      <canvas ref={canvasRef} className="hidden" />
      {stream && !error && (
        <button
          onClick={handleCapture}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-cyan-500 flex items-center justify-center hover:bg-gray-200 transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          aria-label="Capture photo"
        >
          <CameraIcon className="w-8 h-8 text-cyan-700" />
        </button>
      )}
    </div>
  );
};

export default CameraView;
