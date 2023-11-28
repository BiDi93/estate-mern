import React from "react";

export default function CreateListing() {
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
              id="file"
              type="file"
              accept="images/*"
              multiple
              className="border p-3 border-gray-400 rounded w-full"
            />
            <button
              className="p3 bg-green-500 text-white border border-green-700 rounded
            uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 uppercase text-white rounded-lg hover:opacity-80 disabled:opacity-95">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
