export function readTextFile(file: Blob, callback: any) {
	const reader = new FileReader();
	reader.onload = () => { callback(reader.result) }
	reader.readAsText(file);
}

export function writeTextFile(content: string, filename: string, extension = ".txt") {

	let textFileAsBlob = new Blob([content], { type: 'text/plain' });

	let downloadLink = document.createElement("a");
	downloadLink.download = `${filename}${extension}`;
	downloadLink.innerHTML = "Download File";
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
