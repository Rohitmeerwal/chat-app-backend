import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
         
cloudinary.config({ 
  cloud_name: 'deucd178g', 
  api_key: '153516235399769', 
  api_secret: '-koiwaHdAFivKJrS1l2prVv4TkQ' 
});

const uploadOnCloudinary = async (localFilePath) => {
 
    try {
        if (!localFilePath) return null;

        const resource = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto"
            })
  
        return resource;
    } catch (error) {
        console.log(error)
        fs.unlink(localFilePath);
        return null;
    }
}

export { uploadOnCloudinary }
