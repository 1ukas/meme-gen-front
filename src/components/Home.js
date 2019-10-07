import React, { Component } from 'react';
import axios from 'axios';
import { save } from 'save-file';
// import Loader from 'react-loader-spinner';

import ImageEditor from './ImageEditor';
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

const auditImageURL = "http://localhost:5001/meme-gen-7aecd/us-central1/auditImage";
class Home extends Component {
  constructor(props) {
    super(props);
    this.onPost = this.onPost.bind(this);
    this.onMakePublic = this.onMakePublic.bind(this);
    this.onSaveToDevice = this.onSaveToDevice.bind(this);

    this.state = {
      imgEdited: null, // image returned from the backend
      isLoading: false, // do we show a loading wheel
      imageType: "" // extension type of the image
    }
  }

  onPost(data) {
    // post data to the backend:
    axios.post(auditImageURL, data, 
      {
          headers: {'Access-Control-Allow-Origin': '*'}
      }, this.setState({ isLoading: true }) // start showing loading wheel
      )
      .then((res) => {
          this.setState({ 
              isLoading: false, // stop showing loading wheel
              imgEdited: res.data._streams[1] // set returned image as downloaded
          });

          // get images base64 meta-data:
          const split = this.state.imgEdited.split(',')[0];
          // get the image filetype:
          this.setState({imageType: GetImageFileType(split)});
      })
      .catch((err) => {
          console.error(err);
      });
      
  }

  onSaveToDevice(name) {
    save(this.state.imgEdited, name + this.state.imageType);
  }

  onMakePublic() {

  }

  render() {
    return(
        <article className="container">

          {
            !this.state.imgEdited &&
            <ImageEditor isLoading={this.state.isLoading} onPost={this.onPost}/>
          }

          {
            this.state.imgEdited &&
            <div className="row no-gutters justify-content-center text-center">
              <ImagePreview imgEdited={this.state.imgEdited} />

              <TextForm isLoading={this.state.isLoading} onMakePublic={this.onMakePublic} 
                      onSaveToDevice={this.onSaveToDevice} imageUploadForm={true} />
            </div>
          }
        </article>
    );
  }
}
export default Home;

const ImagePreview = (props) => {
  return(
    <section className="image-window col-11 col-lg-6">
      <img src={props.imgEdited} alt="" />
    </section>
  );
}
