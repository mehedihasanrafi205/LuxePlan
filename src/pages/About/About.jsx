import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { 
  FiTarget, 
  FiStar, 
  FiAward, 
  FiPenTool, 
  FiZap, 
  FiUsers, 
  FiCheckCircle, 
  FiBriefcase 
} from "react-icons/fi";

const teamMembers = [
  {
    name: "Mehedi Hasan Rafi",
    role: "Founder & CEO",
    image: "https://i.ibb.co/Dg4DbGsh/Untitled-design-9.png",
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
    image: "https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740&q=80",
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
    <div className="min-h-screen  text-base-content font-sans overflow-hidden">
        
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-32 pb-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        
        <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary uppercase tracking-[0.3em] text-sm font-semibold mb-4 block"
        >
            Since 2018
        </motion.span>
        
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold font-serif text-primary mb-6 leading-tight"
        >
          Crafting Unforgettable <br className="hidden md:inline" /> Experiences
        </motion.h1>
        
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-base-content/70 leading-relaxed"
        >
          LuxePlan specializes in merging premium smart home integration with high-end ceremony decoration. 
          We deliver elegance, sophistication, and personalized design to turn your aspirations into breathtaking realities.
        </motion.p>
      </section>

      {/* 2. Story Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 will-change-transform"
          >
            <h2 className="text-4xl font-bold font-serif text-primary border-l-4 border-primary pl-6">Our Story</h2>
            <p className="text-base-content/80 text-lg leading-relaxed">
              Founded in 2018, LuxePlan has been redefining luxury event and home design. 
              We recognized a need to seamlessly blend <span className="text-primary font-semibold">artistry</span> and <span className="text-primary font-semibold">technology</span>—ensuring that smart home functionality enhances, rather than detracts from, sophisticated interior design.
            </p>
            <p className="text-base-content/80 text-lg leading-relaxed">
              With a team of visionary designers and certified technicians, we combine art, tech innovation, and personalized consultation to craft environments that reflect every client’s unique style and aspiration.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="grid gap-6 will-change-transform"
          >
            {[
              { icon: FiTarget, title: "Our Mission", desc: "To merge artistry and technology, creating bespoke environments that reflect our clients’ individuality with elegance." },
              { icon: FiStar, title: "Our Vision", desc: "To become the leading name in luxury event and smart home design, continuously innovating to redefine elegance." }
            ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-base-200/50 hover:bg-base-200 border border-base-300 hover:border-primary/30 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                            <item.icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold font-serif">{item.title}</h3>
                    </div>
                    <p className="text-base-content/70 pl-2 border-l-2 border-base-300 group-hover:border-primary transition-colors">
                        {item.desc}
                    </p>
                </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. The Difference (Core Values) */}
      <section className="py-24 bg-base-200 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-serif mb-4">The <span className="text-primary">LuxePlan</span> Difference</h2>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiPenTool, title: "Bespoke Creativity", desc: "Innovative design solutions tailored for every unique client experience.", color: "primary" },
              { icon: FiZap, title: "Smart Integration", desc: "Seamlessly blending sophisticated technology with artistic décor.", color: "secondary" },
              { icon: FiAward, title: "Unmatched Excellence", desc: "Uncompromising quality and meticulous attention to every detail.", color: "accent" }
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/20 group will-change-transform"
              >
                <div className="card-body items-center text-center p-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-base-200 group-hover:bg-primary group-hover:rotate-6 transition-all duration-500`}>
                    <val.icon className="text-3xl text-primary group-hover:text-primary-content transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-serif">{val.title}</h3>
                  <p className="text-base-content/60 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Team Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold tracking-widest uppercase">Experts</span>
          <h2 className="text-4xl font-bold font-serif mt-2">Meet the Visionaries</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
           {teamMembers.map((member, idx) => (
               <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group will-change-transform"
               >
                   <div className="relative overflow-hidden rounded-3xl aspect-[3/4] mb-6 shadow-lg">
                       <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                           <p className="text-white/90 text-sm">Passionate about creating perfection.</p>
                       </div>
                   </div>
                   <div className="text-center">
                       <h3 className="text-xl font-bold font-serif">{member.name}</h3>
                       <p className="text-primary text-sm uppercase tracking-wider mt-1">{member.role}</p>
                   </div>
               </motion.div>
           ))}
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="bg-base-200 py-24 px-6">
        <div className="container mx-auto max-w-6xl">
           <div className="text-center mb-16">
                <FiUsers className="text-4xl text-primary mx-auto mb-4" />
                <h2 className="text-4xl font-bold font-serif">What Clients Say</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-base-100 p-8 rounded-2xl shadow-lg relative will-change-transform"
                  >
                      <div className="absolute top-8 right-8 text-primary/10">
                          <FiZap size={60} />
                      </div>
                      <div className="flex text-primary mb-6">
                          {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current" />)}
                      </div>
                      <p className="text-base-content/80 italic mb-6 relative z-10 leading-relaxed">"{t.text}"</p>
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                              {t.name.charAt(0)}
                          </div>
                          <div>
                              <h4 className="font-bold">{t.name}</h4>
                              <p className="text-xs uppercase text-base-content/50">{t.role}</p>
                          </div>
                      </div>
                  </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-24 text-center px-6">
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-secondary p-1 rounded-3xl will-change-transform"
         >
            <div className="bg-base-100 rounded-[22px] py-16 px-8 md:px-20">
                <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Ready for the Extraordinary?</h2>
                <p className="text-lg text-base-content/70 mb-10 max-w-2xl mx-auto">
                    Let us transform your vision into a reality that surpasses even your wildest dreams.
                </p>
                <Link 
                    to="/contact" 
                    className="btn btn-primary btn-lg rounded-full px-12 shadow-xl hover:shadow-primary/50 transition-all hover:scale-105"
                >
                    Start Your Journey
                </Link>
            </div>
         </motion.div>
      </section>

    </div>
  );
};

export default About;
