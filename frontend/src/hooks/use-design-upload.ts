import { designApi } from "../api/api";
import { Design, Error } from "../main.types";
import { BackendError } from "./hooks.types";

export default function useDesignUpload(files : File[]) {
  const [uploadDesigns] = designApi.useUploadDesignMutation();
  const formData = new FormData();
  
  const uploadJobDesigns = async () : Promise<Design[] | Error> => {
    // Add each file to the form:
    files.forEach((file) => {
      formData.append('files', file);
    })

    try {
      const response = await uploadDesigns(formData).unwrap()
      console.log(response);
      return response;
    } catch (error : unknown) {
      return (error as BackendError)?.data?.error;
    }
  }

  return uploadJobDesigns;
}