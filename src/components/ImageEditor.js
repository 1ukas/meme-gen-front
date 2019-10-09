import React, { Component } from 'react';
import axios from 'axios';

import ImageDragAndDrop from './ImageDragAndDrop';
import TextForm from './TextForm';

const GetImageFileType = (imageData) => {
	// Gets the image file extension based on the image' meta-data:
	if (imageData.includes('png')) {
		return '.png';
	}
	else {
		return '.jpeg';
	}
}

const ImageWindow = (props) => {
	return (
		<section className="col-11 col-lg-6">
			<div className="image-window">
				<img src={props.window.imgUploaded} alt="" />
				<div className="image-text">
					<h2 id="image-top-text">{props.window.topText}</h2>
					<h2 id="image-bottom-text">{props.window.bottomText}</h2>
				</div>
			</div>
			<p><i>this is just a preview, the final image might have different word spacing</i></p>
		</section>
	);
}

const maxTextLength = 50;
const auditImageURL = "http://localhost:5001/meme-gen-7aecd/us-central1/auditImage";
class ImageEditor extends Component {
	constructor(props) {
		super(props);
		this.onChangeText = this.onChangeText.bind(this);
		this.onSetImageUploaded = this.onSetImageUploaded.bind(this);
		this.onPost = this.onPost.bind(this);

		this.state = {
			topText: "",
			bottomText: "",
      imgUploaded: null, // image uploaded by the user
      isLoading: false // do we show a loading wheel
		}
	}

	onChangeText(e, topBottom) {
		// True for Top Text
		// False for Bottom Text

		// If string is not going to be longer than max length, update it:
		if (!(e.target.value.length > maxTextLength)) {
			topBottom && this.setState({ topText: e.target.value });
			!topBottom && this.setState({ bottomText: e.target.value });
		}
	}

	onSetImageUploaded(image) {
		this.setState({ imgUploaded: image });
	}

	onPost() {
		// prepare data to be sent to the backend:
		const data = {
			topText: this.state.topText,
			bottomText: this.state.bottomText,
			imageData: this.state.imgUploaded
		}
    
    // post data to the backend:
		axios.post(auditImageURL, data,
			{
				headers: { 'Access-Control-Allow-Origin': '*' }
			}, this.setState({ isLoading: true }) // start showing loading wheel
		)
			.then((res) => {
        this.setState({ isLoading: false }); // stop showing loading wheel
        
        const resImage = res.data._streams[1]; // set returned image as downloaded

				// get images base64 meta-data:
				const split = resImage.split(',')[0];
        // get the image filetype and return the image:
        this.props.setReturnedImage(resImage, GetImageFileType(split));
			})
			.catch((err) => {
				console.error(err);
			});
	}

	render() {
		const window = {
			imgUploaded: this.state.imgUploaded,
			topText: this.state.topText,
			bottomText: this.state.bottomText
		}

		const textForm = {
			topText: this.state.topText,
			bottomText: this.state.bottomText,
			onChangeText: this.onChangeText,
			onPost: this.onPost
		}

		return (
			<section>
				{
					this.state.imgUploaded ?
						<div className="row no-gutters justify-content-center text-center">
							<ImageWindow window={window} />

							<TextForm textForm={textForm} isLoading={this.state.isLoading} imageEditingForm={true} />
						</div>
						:
						<ImageDragAndDrop setImagePreview={this.onSetImageUploaded} />
				}
			</section>
		);
	}
}
export default ImageEditor;