import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteFailure,
  deleteSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";
import { app } from "../firebase";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePerc, setFilePerc] = useState(0);
  const fileRef = useRef(null);
  const [fileError, setFileError] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userDataListings, setUserDataListings] = useState(false);
  // console.log(filePerc);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFormData = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSignOut = async (e) => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/user/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleDeleteAction = async (e) => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = res.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleUpdateForm = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      setUpdateStatus(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  // handle show listing submit button
  const handleShowListing = async (e) => {
    try {
      const res = await fetch(`api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserDataListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete-listing/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserDataListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center my-7">PROFILE</h1>
      <form onSubmit={handleUpdateForm} className="flex flex-col gap-3">
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          referrerPolicy="no-referrer"
          className="rounded-full h-20 w-20 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-700">Error image upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-500">{`Uploading in progress ${filePerc}%`}</span>
          ) : filePerc === 100 && fileError === false ? (
            <span className="text-green-500">Upload success</span>
          ) : (
            ""
          )}
        </p>

        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
        />
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleFormData}
          className="border-dashed border-2 p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          onChange={handleFormData}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleFormData}
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-60"
        >
          {loading ? "Updating...." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white uppercase rounded-lg p-3 text-center hover:opacity-80"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAction}
          className="text-red-700 cursor-pointer"
        >
          Delete User
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-600 mt-5">{error ? error : " "}</p>
      <p className="text-green-700 mt-5">
        {updateStatus ? "Update Success !!!!" : ""}
      </p>

      <button onClick={handleShowListing} className="text-green-700 w-full">
        Show listing
      </button>
      <p className="text-red-700 my-5">
        {showListingError ? "Error showing listing items" : ""}
      </p>
      {userDataListings && userDataListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userDataListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/edit-listings/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
