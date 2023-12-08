type JobViewProducerProps = {
  jobId: string;
};

export default function JobViewProducer({ jobId }: JobViewProducerProps) {
  return <h1>Producer Job View {jobId}</h1>;
}
