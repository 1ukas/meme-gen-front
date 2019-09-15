import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

import ImageDragAndDrop from './components/ImageDragAndDrop';

const TextForm = (props) => {
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

const maxTextLength = 50;
class App extends Component {
  constructor(props) {
    super(props);
    this.setImagePreview = this.setImagePreview.bind(this);
    this.setImageFile = this.setImageFile.bind(this);
    this.onChangeTopText = this.onChangeTopText.bind(this);
    this.onChangeBottomText = this.onChangeBottomText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      imgPreview: null,
      imgFile: null,
      topText: "",
      bottomText: ""
    }
  }

  setImageFile(imageFile) {
    this.setState({
      imgFile: imageFile
    });
  }

  setImagePreview(image) {
    this.setState({
      imgPreview: image
    });
  }

  onChangeTopText(e) {
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

    let data = new FormData();
    data.append('file', this.state.imgPreview);
    data.set('topText', this.state.topText);
    data.set('bottomText', this.state.bottomText);

    axios.post("http://localhost:4000/memeapi", data,
    {
      headers: {'content-type': `multipart/form-data; boundary=${data._boundary}`, }
    }
    )
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return(
      <div className="App">
        <div className="row justify-content-center text-center">
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-6">
            <h1>Meme Generator</h1>
            {this.state.imgPreview !== null ? 
              <div className="imagePreview">
                <img src={this.state.imgPreview} alt=""/>
                <div className="inside">
                  <h2 id="topText">{this.state.topText}</h2>
                  <h2 id="bottomText">{this.state.bottomText}</h2>
                </div>
              </div> :
              <ImageDragAndDrop 
                          setImagePreview={this.setImagePreview}
                          setImageFile={this.setImageFile} />}
          </div>
        </div>
        <div className="row justify-content-center text-center">
          {this.state.imgPreview !== null ? 
          <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-6">
            <p><i>this is just a preview, final image might have different word spacing</i></p>
            <TextForm onSubmit={this.onSubmit} 
                      topText={this.state.topText} 
                      bottomText={this.state.bottomText}
                      onChangeTopText={this.onChangeTopText} 
                      onChangeBottomText={this.onChangeBottomText} /> 
          </div> : null}
        </div>
      </div>
    );
  }
}
export default App;
