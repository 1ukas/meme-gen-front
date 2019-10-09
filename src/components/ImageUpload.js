import React, { Component } from 'react';
import { save } from 'save-file';

import TextForm from './TextForm';

class ImageUpload extends Component {
	constructor(props) {
		super(props);
		this.onSaveToDevice = this.onSaveToDevice.bind(this);
		this.onMakePublic = this.onMakePublic.bind(this);

		this.state = {
			isLoading: false
		}
	}

	onSaveToDevice(name) {
		save(this.props.imgEdited, name + this.props.imgType);
	}

	onMakePublic() {

	}

	render() {
		return (
			<div className="row no-gutters justify-content-center text-center">
				<ImagePreview imgEdited={this.props.imgEdited} />

				<TextForm isLoading={this.state.isLoading} onMakePublic={this.onMakePublic}
					onSaveToDevice={this.onSaveToDevice} imageUploadForm={true} />
			</div>
		);
	}
}
export default ImageUpload;

const ImagePreview = (props) => {
	return (
		<section className="image-window col-11 col-lg-6">
			<img src={props.imgEdited} alt="" />
		</section>
	);
}
