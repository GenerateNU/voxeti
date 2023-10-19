import Auth from "../components/Auth/Auth";

export default function Protected() {
  return (
    <Auth authRoute={true}>
      <h1>This route is protected!</h1>
    </Auth>
  );
}
