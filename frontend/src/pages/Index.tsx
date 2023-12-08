import router from "../router";

export default function Index() {
  return (
    <>
      <div
        id="hero"
        className="flex flex-col w-full mx-auto mt-52 z-0 before:-z-10 before:content-normal before:absolute before:w-full before:h-full before:top-20 before:left-0 before:bg-[url('src/assets/logo.png')] before:bg-center before:bg-no-repeat before:opacity-5"
      >
        <h1
          id="hero-title"
          className="mx-auto font-bold font-display text-6xl text-center p-10"
        >
          {`No Printer? `}
          <span className="bg-gradient-to-r from-producer to-designer inline-block text-transparent bg-clip-text">
            No Problem.
          </span>
        </h1>
        <p className="text-lg max-w-3xl p-8 mx-auto text-center">
          Whether you are looking to utilize your 3D-printer or connect with
          someone, join Voxeti today and have all of your 3D-printing needs
          satisfied
        </p>
        <a href="/register">
          <button className="bg-primary/90 px-10 mx-auto py-4 rounded-md text-background font-bold font-display flex items-center space-x-2">
            <p>Get Started</p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12.5701L10.5489 4.02254L4.33037 4.02254L4.33037 2L14 2L14 11.6696L11.9775 11.6696L11.9775 5.45243L3.42987 14L2 12.5701Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </a>
        <div
          id="hero-images"
          className="flex flex-row justify-around flex-wrap p-10"
        >
          <img
            src="src/assets/hero-image-1.png"
            className="rounded-xl max-w-md p-10"
          />
          <img
            src="src/assets/hero-image-2.png"
            className="rounded-xl max-w-md hidden lg:block p-10"
          />
        </div>
      </div>

      <div id="process" className="px-10 max-w-7xl w-full mx-auto">
        <h1 className="font-bold font-display text-4xl text-center p-10">
          Printing with Voxeti is easier than ever
        </h1>
        <div
          id="process-steps"
          className="flex flex-row flex-wrap gap-8 justify-center"
        >
          <div
            id="step-1"
            className="bg-primary/5 p-10 xl:px-32 rounded-md outline outline-primary/10 outline-2"
          >
            <img
              src="src/assets/process-image-1.png"
              className="rounded-xl max-w-xs pb-10 px-10 mx-auto h-40"
            />
            <h2 className="text-center font-bold font-display">
              Create a job request
            </h2>
            <p className="max-w-xs text-center text-primary/50">
              Browse and request a job with your desired producer Browse and
              request a job with your
            </p>
          </div>
          <div
            id="step-2"
            className="bg-primary/5 p-10 xl:px-32 rounded-md outline outline-primary/10 outline-2"
          >
            <img
              src="src/assets/process-image-2.png"
              className="rounded-xl max-w-xs pb-10 px-10 mx-auto h-40"
            />
            <h2 className="text-center font-bold font-display">
              Connect with a Producer
            </h2>
            <p className="max-w-xs text-center text-primary/50">
              Browse and request a job with your desired producer Browse and
              request a job with your
            </p>
          </div>
          <div
            id="step-3"
            className="bg-primary/5 p-10 xl:px-32 rounded-md outline outline-primary/10 outline-2"
          >
            <img
              src="src/assets/process-image-3.png"
              className="rounded-xl max-w-xs pb-10 px-10 mx-auto h-40"
            />
            <h2 className="text-center font-bold font-display">Production</h2>
            <p className="max-w-xs text-center text-primary/50">
              Browse and request a job with your desired producer Browse and
              request a job with your
            </p>
          </div>
          <div
            id="step-4"
            className="bg-primary/5 p-10 xl:px-32 rounded-md outline outline-primary/10 outline-2"
          >
            <img
              src="src/assets/process-image-4.png"
              className="rounded-xl max-w-xs pb-10 px-10 mx-auto h-40"
            />
            <h2 className="text-center font-bold font-display">Delivery</h2>
            <p className="max-w-xs text-center text-primary/50">
              Browse and request a job with your desired producer Browse and
              request a job with your
            </p>
          </div>
        </div>
      </div>

      <div id="benefits" className="max-w-7xl mx-auto p-10">
        <div id="benefit1" className="flex max-w-5xl flex-row">
          <div id="benefit1-text" className="basis-2/4 my-auto p-10 grow">
            <h1 className="font-bold font-display text-4xl">
              Hassle-free printing
            </h1>
            <p className="my-4 text-lg text-primary/50">
              Push away the woes of owning your own 3D printer. Submit your
              prints from anywhere, at any time. We connect you to experts who
              are able to print and ship your designs, so that you can sit back
              and relax.
            </p>
          </div>
          <div
            id="benefit1-image"
            className="hidden md:block basis-2/4 my-auto"
          >
            <img
              src="src/assets/hassle-free-printing.png"
              className="rounded-xl p-20 h-96"
            />
          </div>
        </div>
        <div id="benefit2" className="flex max-w-5xl flex-row">
          <div
            id="benefit2-image"
            className="hidden md:block basis-2/4 my-auto pl-20"
          >
            <img
              src="src/assets/no-hidden-fees.png"
              className="rounded-xl px-10 pb-10 h-80"
            />
          </div>
          <div id="benefit2-text" className="basis-2/4 p-10 grow">
            <h1 className="font-bold font-display text-4xl pt-10">
              No hidden fees.
            </h1>
            <p className="my-4 text-lg text-primary/50">
              Voxeti offers transparent and affordable pricing. Our pricing is
              based on factors such as the complexity of your design, the size
              of your object, and the type of printer you choose. There are no
              hidden fees or surprises, and our instant quotes make it easy for
              you to see the cost upfront.
            </p>
          </div>
        </div>
      </div>
      <div id="producers" className="p-10 max-w-7xl mx-auto">
        <img
          id="producers-image"
          src="src/assets/already-have-a-printer.png"
          className="rounded-xl h-72 mx-auto"
        />
        <div
          id="producers-text"
          className="my-auto p-10 grow flex flex-col text-center max-w-5xl"
        >
          <h1 className="font-bold font-display text-4xl">
            Already have a printer? Join Voxeti as a Producer.
          </h1>
          <p className="my-4 text-lg text-primary/50 max-w-2xl w-full mx-auto">
            Access a network of skilled 3D printer owners who are passionate
            about bringing your designs to life. You can choose from a variety
            of printers, each with its own unique capabilities and specialties.
          </p>
          <button
            className="bg-primary/90 mt-4 p-4 rounded-md text-background font-bold font-display mx-auto"
            onClick={() => router.navigate({ to: '/register' })}
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </>
  );
}
