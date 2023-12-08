import { designApi } from "../../../../api/api";
import Divider from "@mui/material/Divider";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";
import StyledButton from "../../../Button/Button";

export default function DesignInfo(props: {
  designId: string;
  quantity: number;
}) {
  const { data } = designApi.useGetFileQuery(props.designId);

  return (
    <div>
      <Divider variant="middle" className="py-3 !m-0" />
      <div className=" py-3" />
      <div className="flex justify-between py-1 items-center">
        <p>Files</p>
        <div className="flex flex-row items-center">
          {data && (
            <StyledButton
              color="seconday"
              size="sm"
              onClick={() => saveAs(data, `voxeti-${props.designId}.stl`)}
            >
              <DownloadIcon fontSize="small" />
            </StyledButton>
          )}
        </div>
      </div>
      <div className=" flex justify-between py-1 mt-6">
        <p>Quantity</p>
        <p>{props.quantity} piece(s)</p>
      </div>
    </div>
  );
}
