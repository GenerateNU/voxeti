import { designApi } from "../../../../api/api";
import Divider from "@mui/material/Divider";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import { saveAs } from "file-saver";

export default function DesignInfo(props: {
  designId: string;
  quantity: number;
}) {
  const { data } = designApi.useGetFileQuery(props.designId);

  return (
    <div>
      <Divider variant="middle" className=" py-3" />
      <div className=" py-3" />
      <div className=" flex justify-between py-1">
        <p>Filename (temp designId)</p>
        <div className=" flex flex-row">
          <p>{props.designId}</p>
          {data && (
            <IconButton
              onClick={() => saveAs(data, `voxeti-${props.designId}.stl`)}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
      <div className=" flex justify-between py-1">
        <p>Quantity</p>
        <p>{props.quantity} piece(s)</p>
      </div>
    </div>
  );
}
