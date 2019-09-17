import React, { Component } from 'react';
import axios from 'axios';
import { save } from 'save-file';
import Loader from 'react-loader-spinner';

import './App.css';

import ImageDragAndDrop from './components/ImageDragAndDrop';

const TextForm = (props) => {
  // Text input form template:
  return (
    <form onSubmit={props.onSubmit}>
      <div className="form-group">
        <label>Top text:</label>
        <input type="text" className="form-control" value={props.topText} onChange={props.onChangeTopText} />
      </div>
      <div className="form-group">
        <label>Bottom text:</label>
        <input type="text" className="form-control" value={props.bottomText} onChange={props.onChangeBottomText} />
      </div>
      <div className="form-group">
        <input type="submit" value="Generate" className="btn btn-light" />
      </div>
    </form>
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

const LoadingSpinner = (props) => {
  // Spinner to indicate loading:
  return (
    <Loader id="loader" type="TailSpin" color="#f8f9fa" width="50" height="50" />
  );
}

const maxTextLength = 50;
class App extends Component {
  constructor(props) {
    super(props);
    this.setImagePreview = this.setImagePreview.bind(this);
    this.onChangeTopText = this.onChangeTopText.bind(this);
    this.onChangeBottomText = this.onChangeBottomText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      imgPreview: null,
      topText: "",
      bottomText: "",
      imgDownloaded: null,
      isLoading: false
    }
  }

  setImagePreview(image) {
    this.setState({
      imgPreview: image
    });
  }

  onChangeTopText(e) {
    // handle top text data on change:
    if (e.target.value.length-1 >= maxTextLength) {
      this.setState({
        topText: this.state.topText
      });
    } 
    else {
      this.setState({
        topText: e.target.value
      });
    }
  }

  onChangeBottomText(e) {
    // Handle bottom text data on change:
    if (e.target.value.length-1 >= maxTextLength) {
      this.setState({
        bottomText: this.state.bottomText
      });
    } 
    else {
      this.setState({
        bottomText: e.target.value
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    // prepare the image and text data that is going to be sent to the backend:
    let data = new FormData();
    data.append('file', this.state.imgPreview);
    data.set('topText', this.state.topText);
    data.set('bottomText', this.state.bottomText);

    // post the data to the backend:
    axios.post("https://fast-badlands-54188.herokuapp.com/memeapi", data,
    {
      headers: {'content-type': `multipart/form-data; boundary=${data._boundary}`, }
    },
    this.setState({
      isLoading: true
    })
    )
    .then((res) => {
      this.setState({
        isLoading: false
      })
      // console.log(res);

      // set the returned image as the downloaded image:
      this.setState ({
        imgDownloaded: res.data._streams[1]
      });

      // remove base64 meta-data:
      const split = this.state.imgDownloaded.split(',')[0];
      // get the image filetype and prompt user to save the file:
      save(this.state.imgDownloaded, 'generated-meme' + GetImageFileType(split));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return(
      <div className="App">
        <div className="container">
          <div className="row justify-content-center text-center" id="heading">
            <h1>Meme Generator</h1>
          </div>
          <div className="inner row justify-content-center text-center">
            <div className="col-11 col-sm-9 col-md-6 col-lg-6 col-xl-5">
              {this.state.imgPreview !== null ? 
              <div>
                <div className="imagePreview">
                  <img src={this.state.imgPreview} alt=""/>
                  <div>
                    <h2 id="topText">{this.state.topText}</h2>
                    <h2 id="bottomText">{this.state.bottomText}</h2>
                  </div>
                </div>
                <p><i>this is just a preview, the final image might have different word spacing</i></p>
              </div> :
                <ImageDragAndDrop setImagePreview={this.setImagePreview} />}
            </div>
            {this.state.imgPreview !== null ? 
              <div className="textForm col-11 col-sm-9 col-md-5 col-lg-4 col-xl-4">
                {this.state.isLoading ? <LoadingSpinner /> :
                <TextForm onSubmit={this.onSubmit} 
                          topText={this.state.topText} 
                          bottomText={this.state.bottomText}
                          onChangeTopText={this.onChangeTopText} 
                          onChangeBottomText={this.onChangeBottomText} /> }
              </div> : null}
          </div>
        </div>
      </div>
    );
  }
}
export default App;
