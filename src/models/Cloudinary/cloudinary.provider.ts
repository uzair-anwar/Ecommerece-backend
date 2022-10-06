import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): any => {
    return v2.config({
      cloud_name: 'instagram-clone-testproject',
      api_key: '841864827988845',
      api_secret: 'WQH_ejo5SiDFh553Mx4VfRpWgwc',
    });
  },
};
