import React from "react";

export default function ContributeToStory() {
  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Contribute to the Story</h3>
      <p className="mb-4">
        We would love to hear your ideas and contributions to continue this story. Please share your thoughts in the
        input field below.
      </p>
      <input type="text" placeholder="Enter your contribution" className="input input-bordered w-full" />
      <button className="btn btn-primary mt-4">Submit</button>
    </div>
  );
}
