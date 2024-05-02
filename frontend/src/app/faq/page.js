"use client"
import React, { useState } from "react";

const Accordion = ({ title, answer }) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className="bg-secondary rounded-lg p-4 m-4">
      <button
        onClick={() => setAccordionOpen(!accordionOpen)}
        className={`flex justify-between items-center w-full py-4 transition duration-300 ease-in-out ${
          accordionOpen ? "text-blue-500" : "text-white"
        }`}
      >
        <span className="text-2xl text-left font-semibold">{title}</span>
        <span
          className={`text-2xl ${
            accordionOpen ? "rotate-180 transition duration-300 ease-in-out" : "transition duration-300 ease-in-out"
          }`}
        >
          &#8595;
        </span>
      </button>
      {accordionOpen && (
        <div className="py-2 text-white">{answer}</div>
      )}
    </div>
  );
};

const FAQPage = () => {
  const faqData = [
    { question: "Who are the workshops intended for?", answer: "The workshops are intended for everyone, from high school students and university students to employed individuals. We offer a basic group for those who have no prior knowledge and wish to step into the world of web programming for the first time. There are also advanced and full-stack groups for those who want to refine and expand their existing knowledge." },
    { question: "What are the requirements for registration in the workshops?", answer: "Given the significant interest and limited capacity, successful completion of an entry test is required for the advanced and full-stack groups, while for the basic group, having the willingness is sufficient." },
    { question: "How long does one workshop cycle last?", answer: "One workshop cycle for a group lasts two months." },
    { question: "How often are the workshops held per week, and how long does one session last?", answer: "Workshops are held twice a week, and one session lasts 3 hours." },
    { question: "In what time slots are the workshops held?", answer: "Workshops are conducted in the morning (9-12 am), afternoon (12:30-3:30 pm), and evening (4:30-7:30 pm) time slots." },
    { question: "Are the workshops also held online?", answer: "Workshops are conducted exclusively live in a classroom specifically designated for workshops." },
    { question: "Where are the workshops held?", answer: "The workshops take place at globalsoft's premises in Široki Brijeg, at the address: Ulica pobijenih franjevaca 25, Široki Brijeg." },
    { question: "Are the workshops free?", answer: "The workshops are free of charge." },
    { question: "Will the workshops also be held in Mostar?", answer: "We plan to hold workshops in Mostar in the future. For all information, follow our official website." },
    { question: "Is there an opportunity for employment at globalsoft with a successfully passed final workshop test?", answer: "The primary goal of the workshops is not the employment of new workers but providing fundamental knowledge in web programming. If there is a need for hiring new colleagues, we will certainly consider those participants who have exceptionally distinguished themselves with their knowledge and talent during the workshops." }
  ];

  return (
    <div className="container">
      <div className="max-w-6xl mx-auto">
        <h1 className="main-title">Frequently Asked Questions</h1>
          {faqData.map((faq, index) => (
            <Accordion key={index} title={faq.question} answer={faq.answer} />
          ))}
      </div>
    </div>
  );
};

export default FAQPage;