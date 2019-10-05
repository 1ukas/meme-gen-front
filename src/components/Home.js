import React, { Component } from 'react';
import axios from 'axios';
import { save } from 'save-file';
import Loader from 'react-loader-spinner';

import ImageDragAndDrop from './ImageDragAndDrop';

const ImageEditor = (props) => {
    return (
        <div className="row no-gutters justify-content-center text-center">
            <section className="row-parent col-11 col-lg-6">
                <div className="image-window">
                    <img src={props.imageView.imgPreview} alt="" />
                    <div className="image-text">
                        <h2 id="image-top-text">{props.imageView.topText}</h2>
                        <h2 id="image-bottom-text">{props.imageView.bottomText}</h2>
                    </div>
                </div>
                <p><i>this is just a preview, the final image might have different word spacing</i></p>
            </section>

            <TextForm textForm={props.textForm} />
        </div>
    );
}

const TextForm = (props) => {
    // Text input form template:
    return (
      <section className="text-input-form mx-auto my-auto col-11 col-lg-5">
          {
              props.textForm.isLoading ?
              <LoadingSpinner /> :
              <div>
                  {props.textForm.showAlert && <AlertBox onHideAlert={props.textForm.onHideAlert} />}
                  <form onSubmit={props.textForm.onSubmit}>
                      <section className="form-group">
                          <input type="text" className="form-control" placeholder="Top text" value={props.textForm.topText} onChange={(e) => props.textForm.onChangeText(e, true)} />
                      </section>
                      <section className="form-group">
                          <input type="text" className="form-control" placeholder="Bottom text" value={props.textForm.bottomText} onChange={(e) => props.textForm.onChangeText(e, false)} />
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

const LoadingSpinner = (props) => {
  // Spinner to indicate loading:
  return (
    <Loader id="loader" type="TailSpin" color="#000000" width="75" height="75" />
  );
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

const GetImageFileType = (imageData) => {
    // Gets the image file extension based on the image' meta-data:
    if (imageData.includes('png')) {
      return '.png';
    }
    else {
      return '.jpeg';
    }
}

const auditImageURL = "http://localhost:5001/meme-gen-7aecd/us-central1/auditImage";
const maxTextLength = 50;

class Home extends Component {
  constructor(props) {
    super(props);
    this.setImagePreview = this.setImagePreview.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onHideAlert = this.onHideAlert.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      imgPreview: null,
      topText: "",
      bottomText: "",
      imgDownloaded: null,
      isLoading: false,
      showAlert: false
    }
  }

  setImagePreview(image) {
    this.setState({ imgPreview: image });
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

  onHideAlert(e) {
    this.setState({ showAlert: false });
  }

  onSubmit(e) {
    e.preventDefault();

    // handle empty text inputs:
    if (this.state.topText.length > 0 || this.state.bottomText.length > 0) {
      this.setState({ showAlert: false });
    }
    else {
      this.setState({ showAlert: true });
      return;
    }

    const data = {
      topText: this.state.topText,
      bottomText: this.state.bottomText,
      imageData: this.state.imgPreview
    }

    axios.post(auditImageURL, data, 
    {
      headers: {'Access-Control-Allow-Origin': '*'}
    }, this.setState({ isLoading: true })
    )
    .then((res) => {
        this.setState({ 
            isLoading: false, // stop showing loading wheel
            imgDownloaded: res.data._streams[1] // set returned image as downloaded
        });

      // get images base64 meta-data:
      const split = this.state.imgDownloaded.split(',')[0];
      // get the image filetype and prompt user to save the file:
      save(this.state.imgDownloaded, 'generated-meme' + GetImageFileType(split));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    const textForm = {
        onSubmit: this.onSubmit,
        topText: this.state.topText,
        bottomText: this.state.bottomText,
        onChangeText: this.onChangeText,
        isLoading: this.state.isLoading,
        showAlert: this.state.showAlert,
        onHideAlert: this.onHideAlert
    }

    const imageView = {
        imgPreview: this.state.imgPreview,
        topText: this.state.topText,
        bottomText: this.state.bottomText
    }

    return(
        <article className="container">
          {
            this.state.imgPreview ?
            <ImageEditor imageView={imageView} textForm={textForm} /> 
            :
            <ImageDragAndDrop setImagePreview={this.setImagePreview} /> 
          }
        </article>
    );
  }
}
export default Home;
