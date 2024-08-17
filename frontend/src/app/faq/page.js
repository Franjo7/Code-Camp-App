"use client";
import React, { useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQPage = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionChange = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
          <Accordion
            key={index}
            sx={{
              backgroundColor: 'rgba(31, 41, 55)',
              borderRadius: '0.5rem',
              padding: '1rem',
              margin: '1rem 0',
              color: 'white'
            }}
            expanded={expandedIndex === index}
            onChange={() => handleAccordionChange(index)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white', fontSize: '2rem' }} />}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: expandedIndex === index ? 'primary.main' : 'white'
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ fontSize: '1rem', color: 'white' }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;