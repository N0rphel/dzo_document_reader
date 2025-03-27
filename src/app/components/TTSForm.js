"use client";

import React, { useState, useRef, useEffect } from "react";

// SVG Icons as React components
const PlayIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		<path d="M8 5v14l11-7z" />
	</svg>
);

const PauseIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
	</svg>
);

const StopIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		<path d="M6 6h12v12H6z" />
	</svg>
);

const VolumeOnIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
	</svg>
);

const VolumeOffIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
	>
		<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
	</svg>
);

export default function TTSPlayer() {
	const [message, setMessage] = useState("");
	const [audioURL, setAudioURL] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [loading, setLoading] = useState(false);
	const [volume, setVolume] = useState(1);
	const audioRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return alert("Please enter a message");

		setLoading(true);
		setAudioURL(null);

		const formData = new FormData();
		formData.append("message", message);

		try {
			const response = await fetch(
				"https://dzo-document-reader.vercel.app/api/hf?type=comp",
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to generate speech");
			}

			const blob = await response.blob();
			const generatedAudioURL = URL.createObjectURL(blob);
			setAudioURL(generatedAudioURL);
		} catch (e) {
			console.error(e);
			alert("Error generating speech");
		} finally {
			setLoading(false);
		}
	};

	const handlePlay = () => {
		if (audioRef.current) {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	const handlePause = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	};

	const handleStop = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			setIsPlaying(false);
		}
	};

	const handleVolumeChange = (e) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
		}
	};

	const toggleMute = () => {
		if (audioRef.current) {
			audioRef.current.muted = !audioRef.current.muted;
		}
	};

	useEffect(() => {
		const audioElement = audioRef.current;
		const handleAudioEnd = () => {
			setIsPlaying(false);
		};

		if (audioElement) {
			audioElement.addEventListener("ended", handleAudioEnd);
			return () => {
				audioElement.removeEventListener("ended", handleAudioEnd);
			};
		}
	}, [audioURL]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
			<div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
				<h1 className="text-2xl font-bold mb-4 text-center">
					Text-to-Speech Generator
				</h1>

				{/* Message Input Form */}
				<form onSubmit={handleSubmit} className="mb-4">
					<textarea
						className="w-full p-2 border rounded mb-2"
						rows={4}
						placeholder="Enter your message..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
						disabled={loading}
					>
						{loading ? "Generating..." : "Generate Speech"}
					</button>
				</form>

				{/* Audio Player Controls */}
				{audioURL && (
					<div className="bg-gray-50 p-4 rounded-md">
						<div className="flex items-center space-x-4 mb-2">
							{/* Play Button */}
							<button
								onClick={handlePlay}
								disabled={!audioURL || isPlaying}
								className="p-2 bg-green-500 text-white rounded disabled:bg-gray-300"
							>
								<PlayIcon />
							</button>

							{/* Pause Button */}
							<button
								onClick={handlePause}
								disabled={!audioURL || !isPlaying}
								className="p-2 bg-yellow-500 text-white rounded disabled:bg-gray-300"
							>
								<PauseIcon />
							</button>

							{/* Stop Button */}
							<button
								onClick={handleStop}
								disabled={!audioURL}
								className="p-2 bg-red-500 text-white rounded disabled:bg-gray-300"
							>
								<StopIcon />
							</button>

							{/* Volume Control */}
							<div className="flex items-center space-x-2">
								<button
									onClick={toggleMute}
									className="p-2 bg-gray-200 rounded"
								>
									{audioRef.current?.muted ? (
										<VolumeOffIcon />
									) : (
										<VolumeOnIcon />
									)}
								</button>
								<input
									type="range"
									min="0"
									max="1"
									step="0.1"
									value={volume}
									onChange={handleVolumeChange}
									className="w-24"
								/>
							</div>
						</div>

						{/* Hidden Audio Element */}
						<audio ref={audioRef} src={audioURL} className="hidden" />
					</div>
				)}
			</div>
		</div>
	);
}
