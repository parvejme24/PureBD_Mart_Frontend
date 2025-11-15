import React from "react";
import ContactInfo from "./ContactInfo/ContactInfo";
import ContactForm from "./ContactForm/ContactForm";
import GoogleMap from "./GoogleMap/GoogleMap";

export default function ContactPageContainer() {
  return (
    <div className="container mx-auto max-w-7xl px-5">
      <ContactInfo />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-14">
        <ContactForm />
        <GoogleMap />
      </div>
    </div>
  );
}
