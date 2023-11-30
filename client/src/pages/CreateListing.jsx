import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
  const [fileUpload, setFileUpload] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(formData);
  const handleEventSubmit = (e) => {
    if (
      fileUpload.length > 0 &&
      fileUpload.length + formData.imageUrls.length < 7
    ) {
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
        })
        .catch((err) => {
          setImageUploadError("Image Upload failed (3 MB Max per image)");
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing ");
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
          console.log(`Upload is ${progress}% complete`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  return (
    <main className="max-w-4xl p-3 mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            required
            maxLength="70"
            minLength="10"
            className="border p-3 rounded-lg"
          ></input>
          <input
            type="text"
            id="desription"
            placeholder="description"
            className="border p-3 rounded-lg"
          ></input>
          <input
            type="text"
            id="address"
            placeholder="address"
            className="border p-3 rounded-lg"
          ></input>
          <div className="flex flex-wrap gap-7">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="sell" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5 " id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5 " id="parking" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5 " id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5 " id="Offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300   rounded-lg"
                type="number"
                id="beds"
                min="0"
                max="10"
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300   rounded-lg"
                type="number"
                id="bathroom"
                min="0"
                max="10"
                required
              />
              <span>Bathroom</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className=" p-3 border border-gray-300   rounded-lg"
                type="number"
                id="RegularPrice"
                min="0"
                max="10"
                required
              />
              <div>
                <span>Regular Price</span>
                <span className="text-xs">( $ / month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center w-3">
              <input
                className=" p-3 border border-gray-300   rounded-lg"
                type="number"
                id="DiscountedPrice"
                min="0"
                max="10"
                required
              />
              <div>
                <span>Discounted Price</span>
                <span className="text-xs">( $ / month)</span>
              </div>
            </div>
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
                console.log(e.target.files);
              }}
              id="file"
              type="file"
              accept="images/*"
              multiple
              className="border p-3 border-gray-400 rounded w-full"
            />
            <button
              onClick={handleEventSubmit}
              className="p3 bg-green-500 text-white border border-green-700 rounded
            uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <p className="text-red-600">{imageUploadError && imageUploadError}</p>
          {/* {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              <div key={index}>
                <img src={url} alt="listing image" />
                <button>Delete</button>
              </div>;
            })} */}

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
          <button className="p-3 bg-slate-700 uppercase text-white rounded-lg hover:opacity-80 disabled:opacity-95">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
