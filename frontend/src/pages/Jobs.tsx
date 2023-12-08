import { useStateSelector } from "../hooks/use-redux";
import Auth from "../components/Auth/Auth";
import JobsProducer from "../components/Jobs/ProducerJobs/JobsProducer";
import JobsDesigner from "../components/Jobs/DesignerJobs/JobsDesigner";

export default function Jobs() {
  const { user } = useStateSelector((state) => state.user);

  return (
    <Auth authRoute={true}>
      {user.userType === "PRODUCER" ? <JobsProducer /> : <JobsDesigner />}
    </Auth>
  );
}
