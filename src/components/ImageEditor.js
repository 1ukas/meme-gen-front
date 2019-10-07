import React, { Component } from 'react';

import ImageDragAndDrop from './ImageDragAndDrop';
import TextForm from './TextForm';

const ImageWindow = (props) => {
    return(
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
class ImageEditor extends Component {
    constructor(props) {
        super(props);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSetImageUploaded = this.onSetImageUploaded.bind(this);
        this.onPrepareData = this.onPrepareData.bind(this);

        this.state = {
            topText: "",
            bottomText: "",
            imgUploaded: null, // image uploaded by the user
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

    onPrepareData() {
        // prepare data to be sent to the backend:
        const data = {
            topText: this.state.topText,
            bottomText: this.state.bottomText,
            imageData: this.state.imgUploaded
        }

        // post to the backend:
        this.props.onPost(data);
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
            onPrepareData: this.onPrepareData
        }

        return(
            <section>
                {
                    this.state.imgUploaded ? 
                    <div className="row no-gutters justify-content-center text-center">
                        <ImageWindow window={window} />

                        <TextForm textForm={textForm} isLoading={this.props.isLoading} imageEditingForm={true}/>
                    </div>
                    :
                    <ImageDragAndDrop setImagePreview={this.onSetImageUploaded} /> 
                }
            </section>
        );
    }
}
export default ImageEditor;