import React from "react";

const teamMembers = [
  {
    name: "Jane Doe",
    role: "Founder & CEO",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBct9ej3O38rIvwP8WJGi1-vf9wLeKxaAAbWPIdnf531YlV-b-xVSTiXAnrfZrIejeKAmP-EEh3rgG5KZniN06K0g3nnkCFppOf0ggB2LizC70nploHZDP_OCjFZGv0cw2ovZupk0FR11T13vY6Ko82KvD_anSBc48rimvem1Rym0FOWHXcHgXoQBO_bIJ-L2mz2zsZXo6N4Abmey6M-qcZ8PGjZ3SixJ21VBKHoXzmfgQXY62GxGx1tKjrE_8GtQXKc3SWWln-xsc",
  },
  {
    name: "John Smith",
    role: "Lead Designer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFpeEJETb0FbLcDjxIkDg1sCs8u4bwR3louwtJxZZ-hVSbj-caYTKCOo_tnMetUSABbTlWBId26h0bXHqb_J44kQNXjxUN_maa_p8OHnScLetkXH_JLS7SmBLRyK7ROqXMxftxJWsJAjp9HamgmDfVg_myu86VweOxPTHi52Os3EVDME4AHl-nyqMWV88FZYaI8owOzKQjycXWePdVcabEjbGUg6hQoUDwZuW7spgUeWH9MDyaOPIrn2JR-eDlPijJ4g17lXK0c-g",
  },
  {
    name: "Emily White",
    role: "Head Technician",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqReRHHtitDC4fc7yCQLh0KXAaVRRrGSxlfuiowph5foa_zp1Rmtabyl0kPPZe9NcdURnkbCJE_5_7Jm7A4mFKqOfiCv5Qwh5FHUnQq8driEVEFUA06tMht43VWV4ZBNdEwKwHX5JSdQ8-RwW5SJ6PBw_BxLcK4flrxgxtPTD48cnnaFrYvvuCQ5v0ImNxy64tMdfjuJMPmlKh29dpZ5GaM6a-lo3u5xC-3B1N3vnT3HGa71_uUwCMpJWnpPVa7FWLnuN2QX-7PO8",
  },
  {
    name: "Michael Brown",
    role: "Client Relations",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCO1xYUI711FXVo9eyVzrUO4iK8-4P38AAbi1TSJgKkiX4_rgtPhxNsjMI7FukDiMOWmobSOnOGM7yb6jTuYQTZ2buHnzpaUjxhdXNbP-8m23BQ3nH0kFwO08LZKbcICeYfHsHb7lq1zE9WsODYP_mOU1lN34NWo3ZpwB2h67LuCgR5e9wMCl1OeSspfbQhvbY956T7y-_PxtU_zuWMjhoP7-gB7ZFTRkMGwO6z5CZ0e4L3unOxfGCk2yt7RcWbwOv_os",
  },
];

const testimonials = [
  {
    name: "Sophia Martinez",
    role: "Event Planner",
    text: "Working with LuxePlan was an absolute delight! Their attention to detail and creativity turned our vision into reality.",
  },
  {
    name: "Liam Johnson",
    role: "Homeowner",
    text: "The team created a smart home setup that feels luxurious yet intuitive. Every detail is perfect!",
  },
  {
    name: "Olivia Brown",
    role: "Bride",
    text: "Our wedding decor was breathtaking. LuxePlan’s craftsmanship and elegance exceeded our expectations!",
  },
];

const About = () => {
  return (
    <main className="bg-background-dark text-white font-display flex flex-col items-center w-full px-4 pb-15 pt-35 space-y-24">
      <div className="max-w-6xl w-full flex flex-col gap-16">

        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="size-16 text-primary">
            <svg fill="none" viewBox="0 0 48 48" className="w-12 h-12">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">
            Crafting Unforgettable Experiences
          </h1>
          <p className="max-w-3xl text-gray-300 text-lg">
            LuxePlan specializes in premium smart home and ceremony decoration, delivering high-end experiences with elegance, sophistication, and personalized design.
          </p>
        </section>

        {/* Company Story */}
        <section className="flex flex-col gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Our Story</h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Founded in 2018, LuxePlan has been redefining luxury event and home design. With a team of visionary designers and artisans, we combine art, technology, and innovation to craft unforgettable experiences that resonate with every client’s unique style and aspirations.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-white/5 p-8 backdrop-blur-lg">
            <h3 className="text-2xl font-bold font-serif text-primary">Our Mission</h3>
            <p className="text-gray-300">
              To merge artistry and technology, creating bespoke environments that reflect our clients’ individuality with elegance and perfection.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-primary/30 bg-white/5 p-8 backdrop-blur-lg">
            <h3 className="text-2xl font-bold font-serif text-primary">Our Vision</h3>
            <p className="text-gray-300">
              To become the leading name in luxury event and home design, continuously innovating to redefine elegance and sophistication worldwide.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="flex flex-col items-center gap-12 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4 rounded-lg p-6 hover:bg-white/5 transition">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">palette</span>
              </div>
              <h4 className="text-xl font-bold text-white">Creativity</h4>
              <p className="text-gray-300 text-center">
                Innovative design solutions tailored for every unique client experience.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg p-6 hover:bg-white/5 transition">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
              </div>
              <h4 className="text-xl font-bold text-white">Excellence</h4>
              <p className="text-gray-300 text-center">
                Uncompromising quality and meticulous attention to every detail.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg p-6 hover:bg-white/5 transition">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <h4 className="text-xl font-bold text-white">Collaboration</h4>
              <p className="text-gray-300 text-center">
                Building strong relationships with clients and partners for successful projects.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="flex flex-col items-center gap-12 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">The LuxePlan Difference</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4 rounded-lg p-6 hover:bg-white/5 transition">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">design_services</span>
              </div>
              <h4 className="text-xl font-bold text-white">Bespoke Design</h4>
              <p className="text-gray-300 text-center text-sm">
                Tailored projects reflecting your unique style and lifestyle.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg p-6 hover:bg-white/5 transition">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">integration_instructions</span>
              </div>
              <h4 className="text-xl font-bold text-white">Seamless Integration</h4>
              <p className="text-gray-300 text-center text-sm">
                Sophisticated technology blended with artistic décor for intuitive smart spaces.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg p-6 hover:bg-white/5 transition">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <h4 className="text-xl font-bold text-white">Unmatched Quality</h4>
              <p className="text-gray-300 text-center text-sm">
                Highest standards of craftsmanship and material selection.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="group flex flex-col items-center text-center">
                <div className="mb-4 w-full overflow-hidden rounded-xl">
                  <div
                    className="w-full bg-center bg-cover aspect-square transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${member.image})` }}
                  ></div>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{member.name}</p>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="flex flex-col items-center gap-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-xl border border-primary/30 backdrop-blur-lg text-gray-300 flex flex-col gap-4">
                <p className="italic">"{t.text}"</p>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-primary text-sm">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default About;
