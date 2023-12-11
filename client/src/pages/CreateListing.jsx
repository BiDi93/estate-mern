import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateListing() {
  // fileUpload is use to tracking state of IMAGE upload
  const [fileUpload, setFileUpload] = useState([]);
  // currentUser is used to reference the user from redux store
  const { currentUser } = useSelector((state) => state.user);
  // formData is used to store the heart of data
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 56,
    discountedPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
  });
  // imageUploadError to throw an error state if there is an error when user trying to upload the image
  const [imageUploadError, setImageUploadError] = useState(false);
  // tracking state to change UPLOAD button
  const [uploading, setUploading] = useState(false);
  // tracking state to change CREATE LISTING button
  const [loading, setLoading] = useState(false);
  // this is to track the state change if there is an error while user trying to submit the form
  const [error, setError] = useState(false);
  const nagivate = useNavigate();
  // this is to track image upload progress
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  // console.log(formData);

  // this is basically to submit the form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return "You must upload at least one image";
      }
      // + sign is use to convert the string data to a Number
      if (+formData.discountedPrice > +formData.regularPrice) {
        return "Discounted price must be lower than Regular Price";
      }
      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-type": "application/JSON",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      nagivate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  //this is to track all the changes from user input
  const handleEventChange = (e) => {
    const { id, checked, value, type } = e.target;
    if (id === "sell" || id === "rent") {
      setFormData({
        ...formData,
        type: id,
      });
    }

    if (id === "parking" || id === "offer" || id === "furnished") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    }

    if (id === "name" || id === "description" || id === "address") {
      setFormData({
        ...formData,
        [id]: value,
      });
    }

    if (type === "number" || type === "text" || type === "textarea") {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };
  // this is to handle user uploading image function to firestore
  const handleEventSubmit = (e) => {
    if (
      fileUpload.length > 0 &&
      fileUpload.length + formData.imageUrls.length < 7
    ) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < fileUpload.length; i++) {
        promises.push(storeImage(fileUpload[i]));
      }
      Promise.all(promises)
        .then((fromDownloadUrls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(fromDownloadUrls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload failed (3 MB Max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing ");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i != index),
    });
  };
  //from firebase documentation
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Math.round(progress));
          // console.log(`Upload is ${progress}% complete`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
          setImageUploadProgress(0);
        }
      );
    });
  };
  return (
    <main className="max-w-4xl p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">ITEM LISTING</h1>
      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            required
            maxLength="70"
            minLength="10"
            className="border p-3 rounded-lg"
            onChange={handleEventChange}
            value={formData.name}
          ></input>
          <textarea
            type="text"
            id="description"
            placeholder="description"
            className="border p-3 rounded-lg"
            value={formData.description}
            onChange={handleEventChange}
          ></textarea>
          <input
            type="text"
            id="address"
            placeholder="address"
            className="border p-3 rounded-lg"
            value={formData.address}
            onChange={handleEventChange}
          ></input>
          <div className="flex flex-wrap gap-7">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sell"
                checked={formData.type === "sell"}
                onChange={handleEventChange}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 "
                id="rent"
                checked={formData.type === "rent"}
                onChange={handleEventChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 "
                id="parking"
                checked={formData.parking}
                onChange={handleEventChange}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 "
                id="furnished"
                checked={formData.furnished}
                onChange={handleEventChange}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5 "
                id="offer"
                checked={formData.offer}
                onChange={handleEventChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300   rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                value={formData.bedrooms}
                onChange={handleEventChange}
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300   rounded-lg"
                type="number"
                id="bathrooms"
                min="0"
                max="10"
                required
                value={formData.bathrooms}
                onChange={handleEventChange}
              />
              <span>Bathroom</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300   rounded-lg"
                type="number"
                id="regularPrice"
                min="56"
                max="10000000"
                required
                value={formData.regularPrice}
                onChange={handleEventChange}
              />
              <div>
                <span>Regular Price</span>
                <span className="text-xs">( $ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center w-3">
                <input
                  className=" p-3 border border-gray-300   rounded-lg"
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="1000000"
                  required
                  value={formData.discountedPrice}
                  onChange={handleEventChange}
                />
                <div>
                  <span>Discounted Price</span>
                  <span className="text-xs">( $ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 ">
            <input
              onChange={(e) => {
                setFileUpload(e.target.files);
              }}
              id="file"
              type="file"
              accept="images/*"
              multiple
              className="border p-3 border-gray-400 rounded w-full"
            />
            <button
              disabled={uploading}
              onClick={handleEventSubmit}
              className="p3 bg-green-500 text-white border border-green-700 rounded
            uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading......" : "Upload"}
            </button>
          </div>
          {imageUploadError ? (
            <span className="text-red-700">{imageUploadError}</span>
          ) : imageUploadProgress > 0 && imageUploadProgress < 100 ? (
            <span className="text-slate-500">{`Uploading in progress ${imageUploadProgress}%`}</span>
          ) : imageUploadProgress === 100 && imageUploadError === false ? (
            <span className="text-green-500">Upload success</span>
          ) : (
            ""
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 uppercase text-white rounded-lg hover:opacity-80 disabled:opacity-95"
          >
            {loading ? "Uploading" : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
