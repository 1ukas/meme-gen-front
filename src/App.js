import React, { Component } from 'react';
//import { Route } from 'react-router-dom';

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

class App extends Component {
  constructor(props) {
    super(props);
    this.setImage = this.setImage.bind(this);
    this.onChangeTopText = this.onChangeTopText.bind(this);
    this.onChangeBottomText = this.onChangeBottomText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      imgSrc: null,
      topText: "",
      bottomText: ""
    }
  }

  setImage(image) {
    this.setState({
      imgSrc: image
    });
  }

  onChangeTopText(e) {
    this.setState({
      topText: e.target.value
    });
  }

  onChangeBottomText(e) {
    this.setState({
      bottomText: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    return(
      <div className="App">
        <div className="row justify-content-center text-center">
          <div className="col-4">
            <h1>Meme Generator</h1>
            {this.state.imgSrc !== null ? 
              <div>
                <div className="imagePreview">
                  <img src={this.state.imgSrc} alt=""/>
                  <h2 id="topText">{this.state.topText}</h2>
                  <h2 id="bottomText">{this.state.bottomText}</h2>
                </div>
                <TextForm onSubmit={this.onSubmit} 
                          topText={this.state.topText} 
                          bottomText={this.state.bottomText}
                          onChangeTopText={this.onChangeTopText} 
                          onChangeBottomText={this.onChangeBottomText} />
              </div> :
              <ImageDragAndDrop setImage = {this.setImage} />}
          </div>
        </div>
      </div>
    );
  }
}
export default App;
