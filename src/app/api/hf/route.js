import { NextResponse } from "next/server";
import { inference } from "../../../utils/hf";

export async function POST(request) {
	try {
		const url = new URL(request.url);
		const type = url.searchParams.get("type");

		const formData = await request.formData();
		const message = formData.get("message");

		if (type === "comp") {
			if (!message) {
				return NextResponse.json(
					{ error: "Message is required" },
					{ status: 400 }
				);
			}

			const voice = await inference.textToSpeech({
				model: "Norphel/MMS-TTS-Dzo-N3",
				inputs: message.toString(), // Ensure message is a string
			});

			// Return the raw audio data as a response
			return new Response(await voice.arrayBuffer(), {
				headers: {
					"Content-Type": "audio/wav",
				},
			});
		}

		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	} catch (error) {
		console.error("Error processing request:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
