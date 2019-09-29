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
      <section className="form-group">
        <input type="text" className="form-control" placeholder="Top text" value={props.topText} onChange={props.onChangeTopText} />
      </section>
      <section className="form-group">
        <input type="text" className="form-control" placeholder="Bottom text" value={props.bottomText} onChange={props.onChangeBottomText} />
      </section>
      <section className="form-group">
        <input type="submit" value="Generate" className="btn btn-dark" />
      </section>
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

const maxTextLength = 50;
class App extends Component {
  constructor(props) {
    super(props);
    this.setImagePreview = this.setImagePreview.bind(this);
    this.onChangeTopText = this.onChangeTopText.bind(this);
    this.onChangeBottomText = this.onChangeBottomText.bind(this);
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

  onHideAlert(e) {
    this.setState({
      showAlert: false
    });
  }

  onSubmit(e) {
    e.preventDefault();

    // handle empty text inputs:
    if (this.state.topText.length <= 0 && this.state.bottomText.length <= 0) {
      this.setState({
        showAlert: true
      });
      return;
    }
    else {
      this.setState({
        showAlert: false
      });
    }

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
      <div>
        <header className="site-header container justify-content-center text-center my-4">
          <h1>Meme Generator</h1>
        </header>

        <article className="container">
          {
            this.state.imgPreview !== null ?
              <div className="row no-gutters justify-content-center text-center">
                <section className="row-parent col-11 col-lg-6">
                  <div className="image-window">
                    <img src={this.state.imgPreview} alt="" />
                    <div className="image-text">
                      <h2 id="image-top-text">{this.state.topText}</h2>
                      <h2 id="image-bottom-text">{this.state.bottomText}</h2>
                    </div>
                  </div>
                  <p><i>this is just a preview, the final image might have different word spacing</i></p>
                </section>

                <section className="text-input-form mx-auto my-auto col-11 col-lg-5">
                  {
                    this.state.isLoading ?
                    <LoadingSpinner /> :
                    <div>
                      {
                        this.state.showAlert && <AlertBox onHideAlert={this.onHideAlert}/>
                      }
                      <TextForm onSubmit={this.onSubmit} 
                                topText={this.state.topText} 
                                bottomText={this.state.bottomText}
                                onChangeTopText={this.onChangeTopText} 
                                onChangeBottomText={this.onChangeBottomText} />
                    </div>
                  }
                </section>
              </div> :
            <section className="row mb-4 justify-content-center text-center">
              <div className="col-11 col-lg-6">
                <ImageDragAndDrop setImagePreview={this.setImagePreview} />              
              </div>
            </section>
          }
        </article>

        <footer className="site-footer mt-2 justify-content-center text-center">
          <section>
            <p>Meme generator by <a href="https://github.com/fanta232">fanta232</a></p>
            <p>Open-sourced on <a href="https://github.com/fanta232/meme-gen-front"><i class="fab fa-github"></i></a></p>
          </section>
        </footer>
      </div>
    );
  }
}
export default App;
