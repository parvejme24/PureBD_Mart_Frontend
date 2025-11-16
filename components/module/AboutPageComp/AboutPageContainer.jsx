import React from "react";
import AboutUs from "./AboutUs/AboutUs";
import WeProvide from "./WeProvide/WeProvide";
import Performance from "./Performance/Performance";
import Team from "./Team/Team";
import Testimonial from "@/components/shared/Testimonial/Testimonial";

export default function AboutPageContainer() {
  return (
    <div>
      <AboutUs />
      <WeProvide />
      <Performance />
      <Team />
      <Testimonial />
    </div>
  );
}
