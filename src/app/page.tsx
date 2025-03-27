import Image from "next/image";
import TTSForm from "./components/TTSForm";

export default function Home() {
	return (
		<div>
			<h1>Dzongkha Document Reader</h1>

			<TTSForm />
		</div>
	);
}
