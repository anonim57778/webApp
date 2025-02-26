export async function FilesToBase64(file: File): Promise<string> {
	const base64 = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = (error) => reject(error);
	});
	return base64;
}
