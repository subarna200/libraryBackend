import cloudinary from "cloudinary";
import "dotenv/config";

cloudinary.v2.config({
  cloud_name: "dhckbghuk",
  api_key: "136928961167224",
  api_secret: "8p3CaLSzCDDPXHiPTRIY_krOT_M",
});

export default cloudinary;
