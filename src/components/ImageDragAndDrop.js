import React, { useCallback, useMemo } from 'react';

import { useDropzone } from 'react-dropzone';

// Image dropzone styles:
const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#949a9f',
	borderStyle: 'dashed',
	backgroundColor: '#ffffff',
	color: '#000000',
	outline: 'none',
	transition: 'border .24s ease-in-out'
};

const activeStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

const maxImageSize = 5242880; // max image size 5MB
const acceptedFileTypes = ['image/jpeg', 'image/png']; // only accept jpeg/png

const ReadImage = (image, setImagePreview) => {
	// Read the uploaded image as a base64 blob and sets in the parents state:
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		setImagePreview(reader.result);
	}, false);
	reader.readAsDataURL(image);
}

const VerifyFile = (file) => {
	// Verify the image and alert the user if is it invalid:
	if (!acceptedFileTypes.includes(file.type)) {
		alert('Unsupported file type!');
		return false;
	}
	else if (file.size > maxImageSize) {
		alert('Image size is too big!');
		return false;
	}
	else {
		// return true if the image is acceptable:
		return true;
	}
}

const ImageDragAndDrop = (props) => {
	const onDropAccepted = useCallback(acceptedFiles => {
		// Handle accepted images:
		// console.log(acceptedFiles);
		if (VerifyFile(acceptedFiles[0])) {
			ReadImage(acceptedFiles[0], props.setImagePreview);
		}
	}, []);

	const onDropRejected = useCallback(rejectedFiles => {
		// Handle rejected images:
		// console.log(rejectedFiles);
		VerifyFile(rejectedFiles[0]);
	}, []);

	const { isDragActive, getRootProps, getInputProps, isDragReject,
		isDragAccept } = useDropzone({
			onDropAccepted,
			onDropRejected,
			accept: acceptedFileTypes,
			maxSize: maxImageSize,
			multiple: false
		});

	const style = useMemo(() => ({
		...baseStyle,
		...(isDragActive ? activeStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isDragActive,
		isDragAccept,
		isDragReject
	]);

	return (
		<section className="row mb-4 justify-content-center text-center">
			<div className="col-11 col-lg-6">
				<div {...getRootProps({ style })}>
					<input {...getInputProps()} />
					{!isDragActive &&
						<div>
							<p><b>Drag an image in or click to upload</b></p>
							<p style={{ fontSize: 12 }}>(5MB max, png/jpeg only)</p>
						</div>}
					{isDragActive && !isDragReject && "Drop the image here..."}
					{isDragReject && "Unsupported file type"}
				</div>
			</div>
		</section>
	);
}

export default ImageDragAndDrop;


