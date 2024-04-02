import { list, put, head } from "@vercel/blob";
import { useEffect, useState } from "react";
import blobs from "../../api/blob";

export const config = {
  runtime: "edge",
  api: {
    bodyParser: false,
  },
};

function Documents() {
  const [image, setImage] = useState(null);
  console.log(image);

  async function uploadImage() {
    "use server";
    const blob = await put("Test_name", image[0], {
      access: "public",
      token: process.env.REACT_APP_BLOB_READ_WRITE_TOKEN,
    });
    console.log(blob);
    return blob;
  }

  async function allImages() {
    await blobs()
  }

  useEffect(() => {
    allImages();
  }, []);

  return (
    <div>
      <label htmlFor="image">Image</label>
      <input
        type="file"
        id="image"
        name="image"
        onChange={(event) => setImage(event.target.files)}
      />
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
}

export default Documents;
