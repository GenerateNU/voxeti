export default function Index() {
  return (
    <>
      <div
        id="hero"
        className="flex flex-col w-full max-w-7xl mx-auto mt-52 z-0 before:-z-10 before:content-normal before:absolute before:w-full before:h-full before:top-20 before:left-0 before:bg-[url('src/assets/logo.png')] before:bg-center before:bg-no-repeat before:opacity-5"
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
          className="flex flex-row justify-around flex-wrap space-y-8 p-10"
        >
          <img
            src="src/assets/hero-image-1.png"
            className="rounded-xl max-w-sm"
          />
          <img
            src="src/assets/hero-image-2.png"
            className="rounded-xl max-w-sm hidden lg:block"
          />
        </div>
        <div id="background-image"></div>
      </div>

      <div id="about" className="flex flex-row p-10 max-w-7xl mx-auto">
        <div id="about-image" className="hidden md:block basis-3/5 my-auto">
          <img src="src/assets/industrialspace.jpg" className="rounded-xl" />
        </div>
        <div id="about-text" className="basis-2/5 my-auto p-10 grow">
          <h2 className="font-bold font-display text-4xl">What is Voxeti?</h2>
          <p className="my-4 text-lg">
            {`Access a network of skilled 3D printer owners who are passionate about bringing your designs to life.
            You can choose from a variety of printers, each with its own unique capabilities and specialties.
            This means you can find the perfect match for your project, whether you're looking for high resolution, multiple colors, or a specific type of material.`}
          </p>
        </div>
      </div>
      <div id="process" className="p-10 bg-primary/10 w-full flex flex-col">
        <h1 className="font-bold font-display text-4xl text-center mb-10">
          Printing with Voxeti is easy.
        </h1>
        <div id="steps" className="flex flex-row mb-10 space-x-8 mx-auto">
          <div id="step1" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold font-display text-xl">
              Create a job request
            </h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
          <div id="step2" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold font-display text-xl">
              Connect with a Producer
            </h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
          <div id="step3" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold font-display text-xl">Production</h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
          <div id="step4" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold font-display text-xl">Delivery</h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
        </div>
        <button className="bg-designer p-4 rounded-md text-background font-bold font-display mx-auto">
          Sign Up Now
        </button>
      </div>
      <div id="benefits" className="max-w-7xl mx-auto p-10">
        <div id="benefit1" className="flex max-w-5xl flex-row mb-20">
          <div id="benefit1-text" className="basis-2/4 my-auto p-10 grow">
            <h1 className="font-bold font-display text-4xl">
              Hassle-free printing
            </h1>
            <p className="my-4 text-lg">
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
            <img src="src/assets/relaxedguy.png" className="rounded-xl" />
          </div>
        </div>
        <div id="benefit2" className="flex max-w-5xl flex-row">
          <div
            id="benefit2-image"
            className="hidden md:block basis-2/4 my-auto"
          >
            <img src="src/assets/happybill.jpg" className="rounded-xl" />
          </div>
          <div id="benefit2-text" className="basis-2/4 my-auto p-10 grow">
            <h1 className="font-bold font-display text-4xl">No hidden fees.</h1>
            <p className="my-4 text-lg">
              Voxeti offers transparent and affordable pricing. Our pricing is
              based on factors such as the complexity of your design, the size
              of your object, and the type of printer you choose. There are no
              hidden fees or surprises, and our instant quotes make it easy for
              you to see the cost upfront.
            </p>
          </div>
        </div>
      </div>
      <div id="producers" className="flex flex-row p-10 max-w-7xl mx-auto">
        <div
          id="producers-text"
          className="basis-2/4 my-auto p-10 grow flex flex-col"
        >
          <h1 className="font-bold font-display text-4xl">
            Already have a printer?{" "}
          </h1>
          <h1 className="font-bold font-display text-4xl">
            Join Voxeti as a Producer.
          </h1>
          <p className="my-4 text-lg">
            Access a network of skilled 3D printer owners who are passionate
            about bringing your designs to life. You can choose from a variety
            of printers, each with its own unique capabilities and specialties.
          </p>
          <button className="bg-producer p-4 rounded-md text-background font-bold font-display mx-auto">
            Sign Up Now
          </button>
        </div>
        <div id="producers-image" className="hidden md:block basis-2/4 my-auto">
          <img src="src/assets/guywithprinter.jpg" className="rounded-xl" />
        </div>
      </div>
    </>
  );
}
