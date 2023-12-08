import { useStateSelector } from "../hooks/use-redux";
import Auth from "../components/Auth/Auth";
import { useParams } from "@tanstack/react-router";
import JobViewProducer from "../components/Jobs/ProducerJobs/JobViewProducer";
import JobViewDesigner from "../components/Jobs/DesignerJobs/JobViewDesigner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "@mui/material";

export default function JobView() {
  const { jobId } = useParams();
  const { user } = useStateSelector((state) => state.user);

  const BackButton = () => {
    return (
      <div
        aria-label="delete"
        className="flex items-center w-[75px] text-[gray] hover:text-[black]"
      >
        <ArrowBackIosIcon fontSize="inherit" />
        <Link
          href="/jobs"
          underline="none"
          color="gray"
          sx={{ cursor: "pointer" }}
          className="!hidden md:!flex hover:text-[black]"
        >
          My Jobs
        </Link>
      </div>
    );
  };

  return (
    <Auth authRoute={true}>
      <div className="w-full flex flex-col justify-center items-center mb-44">
        <div className="w-[75%] mt-32">
          <BackButton />
          {user.userType === "PRODUCER" ? (
            <JobViewProducer jobId={jobId as string} />
          ) : (
            <JobViewDesigner jobId={jobId as string} />
          )}
        </div>
      </div>
    </Auth>
  );
}
