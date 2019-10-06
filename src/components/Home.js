import React, { Component } from 'react';
import axios from 'axios';
import { save } from 'save-file';

import ImageEditor from './ImageEditor';

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

    this.state = {
      imgEdited: null, // image returned from the backend
      isLoading: false // do we show a loading wheel
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
          // get the image filetype and prompt user to save the file:
          save(this.state.imgEdited, 'generated-meme' + GetImageFileType(split));
      })
      .catch((err) => {
          console.error(err);
      });
  }

  render() {
    return(
        <article className="container">

          <ImageEditor isLoading={this.state.isLoading} onPost={this.onPost}/>

        </article>
    );
  }
}
export default Home;
