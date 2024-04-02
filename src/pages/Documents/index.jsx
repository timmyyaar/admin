import { list, put } from "@vercel/blob";
import { useEffect, useState } from "react";

function Documents() {
  const [image, setImage] = useState(null);
  console.log(image);

  async function uploadImage() {
    "use server";
    const blob = await put("Test_name", image[0], {
      access: "public",
    });
    return blob;
  }

  async function allImages() {
    const blobs = await list({
      access: "public",
    });
    console.log(blobs);
    const response = await blobs;

    console.log(response);
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
