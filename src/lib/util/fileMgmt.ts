export function readTextFile(file: Blob, callback: any) {
	const reader = new FileReader();
	reader.onload = () => { callback(reader.result) }
	reader.readAsText(file);
}

export function writeTextFile(content: string, filename: string, extension = ".txt") {

	let textFileAsBlob = new Blob([content], { type: 'text/plain' });

	// @ts-ignore
	if (window?.showSaveFilePicker) {

		// @ts-ignore
		showSaveFilePicker({
			suggestedName: filename,
			types: [
				{
					description: `${extension} File`,
					accept: { "application/json": [extension] }
				}
			]
		})
			.then((handle: any) => {
				return handle.createWritable()
			})
			.then((writable: any) => {
				writable.write(textFileAsBlob);
				writable.close();
			})

		/* const handle = await showSaveFilePicker();
		const writable = await handle.createWritable();
		await writable.write(image);
		writable.close(); */
	} else {

		let downloadLink = document.createElement("a");
		downloadLink.download = `${filename}${extension}`;
		downloadLink.innerHTML = "Download File";
		// downloadLink.target = "_blank";
		// downloadLink.type = "application/octet-stream";

		//	if (window.webkitURL != null) {
		//		// Chrome allows the link to be clicked without actually adding it to the DOM.
		//		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		//	} else {
		// Firefox requires the link to be added to the DOM before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = (ev) => {
			// remove the link from the DOM
			document.body.removeChild(downloadLink);
		};
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
		//	}

		downloadLink.click();
	}

}
