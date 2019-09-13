import React, { useCallback, useMemo } from 'react';

import { useDropzone } from 'react-dropzone';

//import './css/ImageDragAndDrop.css';

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
    backgroundColor: '#43474b',
    color: '#bdbdbd',
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

const ImageDragAndDrop = (props) => {
    const maxImageSize = 5242880; // max image size 5MB
    const acceptedFileTypes = ['image/jpeg', 'image/png'];

    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            console.log(reader.result);
            props.setImage(reader.result);
        }, false);
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    const { isDragActive, getRootProps, getInputProps, isDragReject, isDragAccept, acceptedFiles, rejectedFiles } = useDropzone({
        onDrop,
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
        <div className = "container">
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                {!isDragActive &&
                <div>
                    <p><b>Drag an image in or click to upload</b></p>
                    <p style={{fontSize: 12}}>(5MB max file size)</p>
                </div>}
                {isDragActive && !isDragReject && "Drop the image here..."}
                {isDragReject && "Unsupported file type"}
            </div>
        </div>
    );
}

export default ImageDragAndDrop;


