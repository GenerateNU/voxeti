export default function Index() {
  return (
    // TODO: This is a placeholder for All-Hands. Replace this and make sure the mobile design looks good
    <>
      <div id="hero" className="flex flex-row p-10 max-w-7xl mx-auto">
        <div id="hero-text" className="basis-2/5 my-auto p-10 grow">
          <h1 className="font-bold text-6xl">No Printer?</h1>
          <h1 className="font-bold text-6xl">No Problem.</h1>
          <p className="my-4 text-lg">
            Join Voxeti today and connect with 3D printer owners eager to help!
          </p>
          <div className="flex flex-row space-x-4">
            <button className="bg-designer p-4 rounded-md text-background font-bold">
              I want to print
            </button>
            <button className="bg-producer p-4 rounded-md text-background font-bold">
              I have a printer
            </button>
          </div>
        </div>
        <div id="hero-image" className="hidden md:block basis-3/5 my-auto">
          <img src="src/assets/peopleprinting.jpg" className="rounded-xl" />
        </div>
      </div>
      <div id="about" className="flex flex-row p-10 max-w-7xl mx-auto">
        <div id="about-image" className="hidden md:block basis-3/5 my-auto">
          <img src="src/assets/industrialspace.jpg" className="rounded-xl" />
        </div>
        <div id="about-text" className="basis-2/5 my-auto p-10 grow">
          <h2 className="font-bold text-4xl">What is Voxeti?</h2>
          <p className="my-4 text-lg">
            {`Access a network of skilled 3D printer owners who are passionate about bringing your designs to life.
            You can choose from a variety of printers, each with its own unique capabilities and specialties.
            This means you can find the perfect match for your project, whether you're looking for high resolution, multiple colors, or a specific type of material.`}
          </p>
        </div>
      </div>
      <div id="process" className="p-10 bg-primary/10 w-full flex flex-col">
        <h1 className="font-bold text-4xl text-center mb-10">
          Printing with Voxeti is easy.
        </h1>
        <div id="steps" className="flex flex-row mb-10 space-x-8 mx-auto">
          <div id="step1" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold text-xl">Create a job request</h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
          <div id="step2" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold text-xl">Connect with a Producer</h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
          <div id="step3" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold text-xl">Production</h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
          <div id="step4" className="basis-1/4">
            <div className="border-designer border-2 rounded-full w-10 h-10 mb-2" />
            <h2 className="font-bold text-xl">Delivery</h2>
            <p className="text-sm">More Details Here. More Details Here.</p>
          </div>
        </div>
        <button className="bg-designer p-4 rounded-md text-background font-bold mx-auto">
          Sign Up Now
        </button>
      </div>
      <div id="benefits" className="max-w-7xl mx-auto p-10">
        <div id="benefit1" className="flex max-w-5xl flex-row mb-20">
          <div id="benefit1-text" className="basis-2/4 my-auto p-10 grow">
            <h1 className="font-bold text-4xl">Hassle-free printing</h1>
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
            <h1 className="font-bold text-4xl">No hidden fees.</h1>
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
          <h1 className="font-bold text-4xl">Already have a printer? </h1>
          <h1 className="font-bold text-4xl">Join Voxeti as a Producer.</h1>
          <p className="my-4 text-lg">
            Access a network of skilled 3D printer owners who are passionate
            about bringing your designs to life. You can choose from a variety
            of printers, each with its own unique capabilities and specialties.
          </p>
          <button className="bg-producer p-4 rounded-md text-background font-bold mx-auto">
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
