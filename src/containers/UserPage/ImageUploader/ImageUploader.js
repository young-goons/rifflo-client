import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import * as loadImage from 'blueimp-load-image';
import { Loader, Dimmer, Button } from 'semantic-ui-react';

import styles from './ImageUploader.module.css';

class ImageUploader extends Component {
    state = {
        isImageLoading: false,
        isFileSelected: false,
        src: null,
        crop: {
            aspect: this.props.aspectRatio,
            width: this.props.cropDefaultWidth,
            x: 0,
            y: 0
        },
        blob: null,
        blobName: null
    };

    cropImgRef = React.createRef();

    onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            this.setState({
                isImageLoading: true,
                isFileSelected: true
            });
            loadImage(
                e.target.files[0],
                img => {
                    this.setState({
                        src: img.toDataURL(),
                        isImageLoading: false,
                    });
                },
                {
                    canvas: true,
                    orientation: true,
                    minWidth: 150,
                    minHeight: 150,
                    maxWidth: this.props.maxWidth,
                    maxHeight: this.props.maxHeight,
                }
            );
        }
    };

    onImageLoaded = (image, crop) => {
        this.imageRef = image;
    };

    onCropChange = (crop) => {
        this.setState({crop});
    };

    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef, crop, this.props.newFilename
            );
            this.setState({croppedImageUrl});
        }
    }

    getCroppedImg = (image, crop, filename) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const cropContext = canvas.getContext("2d");

        cropContext.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.log("Canvas is empty");
                    return;
                }
                blob.name = filename;
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
                this.setState({blob: blob, blobName: filename});
            }, "image/jpeg");
        });
    };

    clickUploadHandler = () => {
        let formData = new FormData();
        formData.append('file', this.state.blob, this.state.blobName);
        this.props.imgHandleClose();
        this.props.onUploadImage(this.props.userId, formData);
    };

    clickRemoveHandler = () => {
        this.props.imgHandleClose();
        this.props.onDeleteImage(this.props.userId);
    };

    render() {
        let imageLoadSpinner;
        if (this.state.isFileSelected && this.state.isImageLoading) {
            imageLoadSpinner = (
                <Dimmer active inverted className={styles.imageLoader}>
                    <Loader size="medium">Loading Image</Loader>
                </Dimmer>
            );
        }
        let cropComponent;
        if (this.state.src) {
            cropComponent = (
                <ReactCrop
                    src={this.state.src} crop={this.state.crop}
                    ref={this.cropImgRef}
                    onImageLoaded={this.onImageLoaded}
                    onChange={this.onCropChange}
                    onComplete={this.onCropComplete}
                />
            );
        }
        let uploadButton;
        if (this.state.croppedImageUrl) {
            // croppedImage = <img style={{ maxWidth: "200px"}} src={this.state.croppedImageUrl}/>
            uploadButton = (
                <div className={styles.buttonDiv}>
                    <Button fluid color="teal" size="medium" onClick={this.clickUploadHandler}>
                        Upload Profile Image
                    </Button>
                </div>
            );
        }
        let removeButton;
        if (this.props.imageSrc && !this.state.isFileSelected) {
            removeButton = (
                <button className={styles.removeButton} onClick={this.clickRemoveHandler}>
                    Remove Current Picture
                </button>
            );
        }
        return (
            <div className={styles.modalDiv}>
                { imageLoadSpinner }
                <div className={styles.modalHeaderDiv}>{this.props.headerSentence}</div>
                <input type="file" className={styles.imgInput} accept=".jpg, .jpeg, .gif, .png"
                       onChange={this.onSelectFile}/>
                { removeButton }
                <div className={styles.loadedImgDiv}>
                    { cropComponent }
                </div>
                { uploadButton }
            </div>
        );
    }
}

export default ImageUploader;