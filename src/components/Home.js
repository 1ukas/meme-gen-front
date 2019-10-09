import React, { Component } from 'react';

import ImageEditor from './ImageEditor';
import ImageUpload from './ImageUpload';

class Home extends Component {
	constructor(props) {
    super(props);
    this.setReturnedImage = this.setReturnedImage.bind(this);

		this.state = {
			imgEdited: null, // image returned from the backend
			imgType: "" // extension type of the image
		}
  }
  
  setReturnedImage(image, type) {
    this.setState({
      imgEdited: image,
      imgType: type
    });
  }

	render() {
		return (
			<article className="container">

				{
					!this.state.imgEdited &&
					<ImageEditor setReturnedImage={this.setReturnedImage} />
				}

				{
					this.state.imgEdited &&
					<ImageUpload imgEdited={this.state.imgEdited} imgType={this.state.imgType} />
        }
        
			</article>
		);
	}
}
export default Home;