import { designApi } from "../api/api";
import { Design, Dimensions, Error } from "../main.types";
import { BackendError } from "./hooks.types";

export default function useDesignUpload(files : File[], dimensions : Dimensions[]) {
  const [uploadDesigns] = designApi.useUploadDesignMutation();
  const formData = new FormData();

  const uploadJobDesigns = async () : Promise<Design[] | Error> => {
    // Add each file to the form:
    files.forEach((file) => {
      formData.append('files', file);
    })

    dimensions.forEach((dimension) => {
      formData.append("dimensions", JSON.stringify(dimension));
    });

    try {
      const response = await uploadDesigns(formData).unwrap();
      return response;
    } catch (error : unknown) {
      return (error as BackendError)?.data?.error;
    }
  };

  return uploadJobDesigns;
}
