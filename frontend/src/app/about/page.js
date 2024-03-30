import React from 'react';

const AboutPage = () => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-semibold mt-5 mb-5 text-white">Our Mission</h2>
          <div className="text-lg text-gray-300">
          <p>
            At GlobalSoft, <span className="font-bold">our mission</span> is to utilize the best modern-day technology to bring businesses to new heights. We specialize in providing high-quality, efficient, and advanced IT solutions that are easy to use and tailored to improve and streamline your business operations.
          </p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-semibold mt-5 mb-5 text-white">Our Vision</h2>
          <div className="text-lg text-gray-300">
          <p>
            Our <span className="font-bold">vision</span> is to be a leading provider of innovative IT solutions and services in Europe and beyond. With over twenty-five successful projects under our belt, we have established ourselves as a reliable partner for developing advanced software solutions, providing IT consulting services, and delivering innovative products.
          </p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-semibold mb-4 mt-8 text-white">Our Values</h2>
          <div className="text-lg text-gray-300">
          <ul>
            <li>Quality: We prioritize delivering high-quality solutions and services to our clients.</li>
            <li>Innovation: We continuously explore and implement innovative technologies to stay ahead of the curve.</li>
            <li>Partnership: We foster strong, collaborative relationships with our clients, based on trust and mutual respect.</li>
            <li>Customer Satisfaction: We are committed to ensuring the satisfaction of our customers by meeting their needs and exceeding their expectations.</li>
          </ul>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-semibold mb-4 mt-8 text-white">Company Overview</h2>
          <div className="text-lg text-gray-300">
          <p><span className="font-bold">GlobalSoft</span> was founded in <span className="font-bold">2016</span> with headquarters in <span className="font-bold">Široki Brijeg</span> and operates as part of the <span className="font-bold">German group Daniel Speyer GmbH</span>. We generate most of our income in the foreign market, mainly in the countries of the European Union.</p>
          <p>
            One part of our company develops our own IT products, implements, and provides comprehensive support for the products of our partners, the world’s leading IT companies. Our team consists of experts who develop and test solutions with advanced technologies and methods, such as DDD, Microservice architecture, and Event sourcing.
          </p>
          <p>
            The other part develops complete innovative services and solutions for our clients - mainly in the gaming industry, as well as e-learning platforms and various systems according to the needs of clients from other industries. We design and develop attractive projects using the latest technological trends, and our experts make sure that everything works flawlessly.
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;