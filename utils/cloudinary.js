import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
         
cloudinary.config({ 
  cloud_name: 'deucd178g', 
  api_key: '153516235399769', 
  api_secret: '-koiwaHdAFivKJrS1l2prVv4TkQ' 
});
//  console.log(cloud, "cloud")

const uploadOnCloudinary = async (localFilePath) => {
 
    try {
        if (!localFilePath) return null;
        // upload file on cloudinary
        const resource = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto"
            })
        // file has been uploaded successfully

        console.log(`File is uploaded successfully`, resource.url);
        return resource;
    } catch (error) {
        console.log(error)
        fs.unlink(localFilePath);
        return null;
    }
}

export { uploadOnCloudinary }
