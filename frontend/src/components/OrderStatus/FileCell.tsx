import { designApi } from "../../api/api";
import { Job } from "../../main.types";
import { Design } from "../../main.types";
import { useState } from "react";

export default function FileCell(props: { job: Job }) {
  const [design, setDesign] = useState<Design[]>([]);

  console.log(design);

  props.job.designId.map((design) => {
    const { data: data } = designApi.useGetDesignQuery(design);
    if (data) {
      setDesign((designs) => {
        designs.push(data);
        return designs;
      });
    }
  });

  return <div className="flex items-center text-lg">{props.job.designId}</div>;
}
