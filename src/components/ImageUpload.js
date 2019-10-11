import React, { Component } from 'react';
import { save } from 'save-file';
import uuidv4 from 'uuid/v4';
import firebase, { storage } from '../firebase';

import '../firebase/auth'; // import anonymous firebase auth

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

	async onSaveToDevice(name) {
		await save(this.props.imgEdited, name + this.props.imgType);
	}

	onMakePublic(name) {
    try {
      const metadata = {
        customMetadata: { 'memeName': name }
      }

      const memesRef = storage.ref(`memes/${uuidv4() + this.props.imgType}`).putString(this.props.imgEdited, 'data_url', metadata);
      memesRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Paused Upload');
            break;
          case firebase.storage.TaskState.RUNNING:
            this.setState({ isLoading: true });
            console.log('Running Upload');
            break;
        }
      }, (error) => {
        throw error;
      }, () => {
        this.setState({ isLoading: false });
      });
    }
    catch (error) {
      console.error(error);
    }
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