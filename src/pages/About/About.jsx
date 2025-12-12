import React from "react";
// Import Feather Icons for consistency and better styling
import {
  FiBriefcase, // Replaced design_services
  FiZap, // Replaced integration_instructions (for technology/smart)
  FiCheckCircle, // Replaced verified
  FiUsers, // Replaced group
  FiStar, // For testimonials
  FiTarget, // For mission/vision
  FiAward, // Replaced precision_manufacturing (Excellence)
  FiPenTool, // Replaced palette (Creativity)
  FiLayers, // General icon for the top
} from "react-icons/fi";
import { Link } from "react-router";

const teamMembers = [
  {
    name: "Mehedi Hasan Rafi",

    role: "Founder & CEO",

    image:
      "https://i.ibb.co/Dg4DbGsh/Untitled-design-9.png",
  },

  {
    name: "John Smith",

    role: "Lead Designer",

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFpeEJETb0FbLcDjxIkDg1sCs8u4bwR3louwtJxZZ-hVSbj-caYTKCOo_tnMetUSABbTlWBId26h0bXHqb_J44kQNXjxUN_maa_p8OHnScLetkXH_JLS7SmBLRyK7ROqXMxftxJWsJAjp9HamgmDfVg_myu86VweOxPTHi52Os3EVDME4AHl-nyqMWV88FZYaI8owOzKQjycXWePdVcabEjbGUg6hQoUDwZuW7spgUeWH9MDyaOPIrn2JR-eDlPijJ4g17lXK0c-g",
  },

  {
    name: "Emily White",

    role: "Head Technician",

    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqReRHHtitDC4fc7yCQLh0KXAaVRRrGSxlfuiowph5foa_zp1Rmtabyl0kPPZe9NcdURnkbCJE_5_7Jm7A4mFKqOfiCv5Qwh5FHUnQq8driEVEFUA06tMht43VWV4ZBNdEwKwHX5JSdQ8-RwW5SJ6PBw_BxLcK4flrxgxtPTD48cnnaFrYvvuCQ5v0ImNxy64tMdfjuJMPmlKh29dpZ5GaM6a-lo3u5xC-3B1N3vnT3HGa71_uUwCMpJWnpPVa7FWLnuN2QX-7PO8",
  },

  {
    name: "Michael Brown",

    role: "Client Relations",

    image:
      "https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

const testimonials = [
  {
    name: "Sophia Martinez",
    role: "Event Planner",
    text: "Working with LuxePlan was an absolute delight! Their attention to detail and creativity turned our vision into reality. Seamless execution!",
  },
  {
    name: "Liam Johnson",
    role: "Homeowner",
    text: "The team created a smart home setup that feels luxurious yet intuitive. The integration of technology and decor is simply perfect!",
  },
  {
    name: "Olivia Brown",
    role: "Bride",
    text: "Our wedding decor was breathtaking. LuxePlan’s craftsmanship and elegance exceeded our expectations, creating a truly magical day!",
  },
];

const About = () => {
  return (
    <main className="bg-base-200 text-base-content flex flex-col items-center w-full px-4 py-16 md:py-24 space-y-24">
      <div className="container w-full flex flex-col gap-24">
        <section className="flex flex-col items-center text-center gap-6 mt-18">
          <div className="p-3 rounded-full bg-primary/20 text-primary animate-pulse-slow">
            <FiLayers size={36} className="rotate-45" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold  font-serif text-primary leading-tight">
            Crafting Unforgettable <br className="hidden md:inline" />{" "}
            Experiences
          </h1>
          <p className="max-w-4xl text-base-content/70 text-lg">
            LuxePlan specializes in premium smart home integration and ceremony
            decoration, delivering high-end experiences with elegance,
            sophistication, and personalized design. We turn aspirations into
            breathtaking realities.
          </p>
        </section>

        <div className="divider opacity-30"></div>

        {/* === 2. Story & Mission/Vision === */}
        <section className="flex flex-col gap-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Story */}
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-bold text-primary">Our Story</h2>
              <p className="text-base-content/80 text-lg leading-relaxed">
                Founded in 2018, LuxePlan has been redefining luxury event and
                home design. We recognized a need to seamlessly blend artistry
                and technology—ensuring that smart home functionality enhances,
                rather than detracts from, sophisticated interior design. With a
                team of visionary designers and certified technicians, we
                combine art, tech innovation, and personalized consultation to
                craft environments that reflect every client’s unique style and
                aspiration.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="flex flex-col gap-6">
              <div className="card bg-base-100 shadow-xl border border-base-300 transition-shadow duration-300 hover:shadow-2xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl font-bold text-accent flex items-center gap-3">
                    <FiTarget size={24} className="text-primary" /> Our Mission
                  </h3>
                  <p className="text-base-content/70">
                    To merge artistry and technology, creating bespoke
                    environments that reflect our clients’ individuality with
                    elegance and technical perfection.
                  </p>
                </div>
              </div>
              <div className="card bg-base-100 shadow-xl border border-base-300 transition-shadow duration-300 hover:shadow-2xl">
                <div className="card-body">
                  <h3 className="card-title text-2xl font-bold text-accent flex items-center gap-3">
                    <FiStar size={24} className="text-primary" /> Our Vision
                  </h3>
                  <p className="text-base-content/70">
                    To become the leading name in luxury event and smart home
                    design, continuously innovating to redefine elegance and
                    sophistication worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider opacity-30"></div>

        {/* === 3. Core Values & Difference === */}
        <section className="flex flex-col items-center gap-12 text-center">
          <h2 className="text-4xl font-bold text-primary">
            The LuxePlan Difference
          </h2>
          <div className="grid md:grid-cols-3 gap-10 w-full">
            {/* Value 1: Creativity/Bespoke */}
            <div className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-primary transition-transform duration-300 hover:scale-[1.03]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-2">
                <FiPenTool size={28} />
              </div>
              <h4 className="text-xl font-bold text-accent">
                Bespoke Creativity
              </h4>
              <p className="text-base-content/70 text-center text-sm">
                Innovative design solutions tailored for every unique client
                experience, ensuring no two projects are ever the same.
              </p>
            </div>

            {/* Value 2: Technology/Integration */}
            <div className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-info transition-transform duration-300 hover:scale-[1.03]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-info/10 text-info mb-2">
                <FiZap size={28} />
              </div>
              <h4 className="text-xl font-bold text-accent">
                Smart Integration
              </h4>
              <p className="text-base-content/70 text-center text-sm">
                Seamlessly blending sophisticated technology with artistic décor
                for intuitive, luxurious smart spaces.
              </p>
            </div>

            {/* Value 3: Excellence/Quality */}
            <div className="flex flex-col items-center gap-4 card bg-base-100 p-8 shadow-xl border-t-4 border-success transition-transform duration-300 hover:scale-[1.03]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-success/10 text-success mb-2">
                <FiAward size={28} />
              </div>
              <h4 className="text-xl font-bold text-accent">
                Unmatched Excellence
              </h4>
              <p className="text-base-content/70 text-center text-sm">
                Uncompromising quality, meticulous attention to detail, and the
                highest standards of craftsmanship.
              </p>
            </div>
          </div>
        </section>

        <div className="divider opacity-30"></div>

        {/* === 4. Team Section === */}
        <section className="flex flex-col items-center gap-16">
          <h2 className="text-4xl font-bold text-primary">
            Meet the Visionaries
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="card bg-base-100 group shadow-lg transition-transform duration-300 hover:scale-[1.05] hover:shadow-2xl"
              >
                <figure className="px-5 pt-5">
                  {/* Using mask and aspect ratio for professional look */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-40 object-scale-down mask mask-squircle transition-opacity duration-300 group-hover:opacity-80"
                  />
                </figure>
                <div className="card-body items-center text-center p-5">
                  <p className="text-lg font-bold text-accent">{member.name}</p>
                  <p className="text-sm font-medium text-primary/80 badge badge-outline badge-primary">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider opacity-30"></div>

        {/* === 5. Testimonials === */}
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-4xl font-bold text-primary">What Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8 w-full">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="card bg-base-100 shadow-xl p-6 border-l-4 border-primary/70 transition-shadow duration-300 hover:shadow-primary/50"
              >
                <div className="flex items-center mb-4 text-primary">
                  <FiStar size={20} className="fill-current mr-1" />
                  <FiStar size={20} className="fill-current mr-1" />
                  <FiStar size={20} className="fill-current mr-1" />
                  <FiStar size={20} className="fill-current mr-1" />
                  <FiStar size={20} className="fill-current" />
                </div>
                <p className="italic text-base-content/90 mb-4 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex flex-col">
                  <p className="font-bold text-accent">{t.name}</p>
                  <p className="text-primary text-sm font-medium">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="text-center pt-16">
        <Link
          to="/contact"
          className="btn btn-lg btn-primary shadow-xl shadow-primary/40 hover:scale-[1.05] transition-transform duration-300"
        >
          Ready to begin your LuxePlan experience? Contact Us
        </Link>
      </section>
    </main>
  );
};

export default About;
