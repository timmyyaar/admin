import { list } from "@vercel/blob";

export const config = {
  runtime: "edge",
};

export default async function blobs(request) {
  const { blobs } = await list({
    token: "vercel_blob_rw_0opeb38vzAkAuyGl_41rVaE2H1j3nc0809Zb73e1WMmy9kU",
  });
  return Response.json(blobs);
}
