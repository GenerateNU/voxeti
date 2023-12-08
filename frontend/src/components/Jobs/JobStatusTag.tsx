import { JobStatus } from "../../main.types"

type JobStatusTagProps = {
  status: JobStatus | 'SHIPPED',
}

export default function JobStatusTag({ status } : JobStatusTagProps) {
  const infoMappings = {
    PENDING: {title: 'Pending', styles: 'bg-background !text-primary'},
    ACCEPTED: {title: 'Accepted', styles: 'bg-producer'},
    INPROGRESS: {title: 'In Progress', styles: 'bg-[#ae7d14]'},
    INSHIPPING: {title: 'In Shipping', styles: 'bg-designer'},
    SHIPPED: {title: 'Shipped', styles: 'bg-designer'},
    COMPLETE: {title: 'Complete', styles: 'bg-[#14AE5C]'}
  }

  return (
      <div className={`p-2 pr-6 pl-6 text-background shadow-md rounded-lg ${infoMappings[status].styles} w-fit`}>
        {infoMappings[status].title}
      </div>
  )
}
