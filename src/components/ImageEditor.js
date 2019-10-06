import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

import ImageDragAndDrop from './ImageDragAndDrop';

const ImageWindow = (props) => {
    return(
        <section className="row-parent col-11 col-lg-6">
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

                        <TextForm textForm={textForm} isLoading={this.props.isLoading}/>
                    </div>
                    :
                    <ImageDragAndDrop setImagePreview={this.onSetImageUploaded} /> 
                }
            </section>
        );
    }
}
export default ImageEditor;

class TextForm extends Component {
    constructor(props) {
        super(props);
        this.onHideAlert = this.onHideAlert.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            showAlert: false
        }
    }

    onHideAlert(e) {
        this.setState({ showAlert: false });        
    }

    onSubmit(e) {
        e.preventDefault();

        // handle empty text inputs:
        if (this.props.textForm.topText.length > 0 || this.props.textForm.bottomText.length > 0) {
            this.setState({ showAlert: false });
            this.props.textForm.onPrepareData();
        }
        else {
            this.setState({ showAlert: true });
            return;
        }
    }

    render() {
        return(
            <section className="text-input-form mx-auto my-auto col-11 col-lg-5">
                {
                    this.props.isLoading ?
                    <LoadingSpinner /> :
                    <div>
                        {this.state.showAlert && <AlertBox onHideAlert={this.onHideAlert} />}
                        <form onSubmit={this.onSubmit}>
                            <section className="form-group">
                                <input type="text" className="form-control" placeholder="Top text" value={this.props.textForm.topText} onChange={(e) => this.props.textForm.onChangeText(e, true)} />
                            </section>
                            <section className="form-group">
                                <input type="text" className="form-control" placeholder="Bottom text" value={this.props.textForm.bottomText} onChange={(e) => this.props.textForm.onChangeText(e, false)} />
                            </section>
                            <section className="form-group">
                                <input type="submit" value="Generate" className="btn btn-dark" />
                            </section>
                        </form>
                    </div>
                }
            </section>    
        );
    }
}

const AlertBox = (props) => {
    return (
      <div className="alert-window alert alert-danger alert-dismissible fade show" role="alert">
        <h4>You should type something in :)</h4>
        <button type="button" className="close  align-middle" data-dismiss="alert" aria-label="Close" onClick={props.onHideAlert}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
}

const LoadingSpinner = (props) => {
    // Spinner to indicate loading:
    return (
      <Loader id="loader" type="TailSpin" color="#000000" width="75" height="75" />
    );
}