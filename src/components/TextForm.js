import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

import AlertBox from './AlertBox';

const maxTextLength = 12;
class TextForm extends Component {
    constructor(props) {
        super(props);
        this.onHideAlert = this.onHideAlert.bind(this);
        this.onSubmitImageEdit = this.onSubmitImageEdit.bind(this);
        this.onSubmitImageUpload = this.onSubmitImageUpload.bind(this);
        this.onChangeNameText = this.onChangeNameText.bind(this);

        this.state = {
            showAlert: false, // do we show the alert box
            name: "" // name of the image
        }
    }

    onHideAlert(e) {
        this.setState({ showAlert: false });        
    }

    onSubmitImageEdit(e) {
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

    onSubmitImageUpload(e, saveOrPublic) {
        e.preventDefault();
        // True for Make Public
        // False for Save To Device

        // handle empty text inputs:
        if (this.state.name.length > 0) {
            this.setState({ showAlert: false });
            saveOrPublic && this.props.onMakePublic(this.state.name);
            !saveOrPublic && this.props.onSaveToDevice(this.state.name);
        }
        else {
            this.setState({ showAlert: true });
            return;
        }
    }

    onChangeNameText(e) {
        if (!(e.target.value.length > maxTextLength)) {
          this.setState({ name: e.target.value });
        }
      }

    render() {
        return(
            <section className="text-input-form mx-auto my-auto col-11 col-lg-5">
                {
                    this.props.imageEditingForm &&
                    <ImageEditingForm isLoading={this.props.isLoading} showAlert={this.state.showAlert}
                                    onHideAlert={this.onHideAlert} topText={this.props.textForm.topText}
                                    bottomText={this.props.textForm.bottomText} onChangeText={this.props.textForm.onChangeText}
                                    onSubmit={this.onSubmitImageEdit} />
                }
                {
                    this.props.imageUploadForm &&
                    <ImageUploadForm isLoading={this.props.isLoading} showAlert={this.state.showAlert}
                                    onHideAlert={this.onHideAlert} name={this.state.name} 
                                    onChangeNameText={this.onChangeNameText} onSubmitImageUpload={this.onSubmitImageUpload} />
                }
            </section>
        );
    }
}
export default TextForm;

const ImageEditingForm = (props) => {
    return(
        <>
            {
                props.isLoading ?
                <LoadingSpinner /> :
                <div>
                    {props.showAlert && <AlertBox onHideAlert={props.onHideAlert} />}
                    <form>
                        <section className="form-group">
                            <input type="text" className="form-control" placeholder="Top text" value={props.topText} onChange={(e) => props.onChangeText(e, true)} />
                        </section>
                        <section className="form-group">
                            <input type="text" className="form-control" placeholder="Bottom text" value={props.bottomText} onChange={(e) => props.onChangeText(e, false)} />
                        </section>
                        <section className="form-group">
                            <button type="button" onClick={props.onSubmit} className="btn btn-dark">Generate</button>
                        </section>
                    </form>
                </div>
            }
        </>    
    );
}

const ImageUploadForm = (props) => {
    return(
        <>
            {
                props.isLoading ?
                <LoadingSpinner /> :
                <div>
                    <p>Make the image public or save it to your device</p>                    
                    {props.showAlert && <AlertBox onHideAlert={props.onHideAlert} />}
                    <form>
                        <section className="form-group">
                            <input type="text" className="form-control" placeholder="Image Name" value={props.name} onChange={props.onChangeNameText} />
                        </section>
                        <section className="form-group">
                            <button type="button" onClick={(e) => props.onSubmitImageUpload(e, true)} className="btn btn-dark mx-2 mb-2">Make Public</button>
                            <button type="button" onClick={(e) => props.onSubmitImageUpload(e, false)} className="btn btn-dark mx-2 mb-2">Save To Device</button>
                        </section>
                    </form>
                </div>
            }
        </>
    );
}

const LoadingSpinner = (props) => {
    // Spinner to indicate loading:
    return (
      <Loader id="loader" type="TailSpin" color="#000000" width="75" height="75" />
    );
}