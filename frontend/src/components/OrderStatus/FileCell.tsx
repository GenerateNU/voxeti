import { designApi } from "../../api/api";
import { Job } from "../../main.types";
import { Design } from "../../main.types";
import { useState } from "react";

export default function FileCell(props: { job: Job }) {
  const [design, setDesign] = useState<Design>({} as Design);

  console.log(design);

  const { data: data } = designApi.useGetDesignQuery(props.job.designId);
  if (data) {
    setDesign(data);
  }

  return <div className="flex items-center text-lg">{props.job.designId}</div>;
}
