import { RecommendValueProps } from "@/types";
import { MoveUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { data } from "@/data";

export const recommendations = [
  {
    label: "Nasa 2025 Mission Fact Sheet",
    value: data,
  },
  {
    label: "FTX Bankruptcy Explained",
    value: "https://www.youtube.com/watch?v=zTFhnpf-IE0",
  },
  {
    label: "What is NextJS?",
    value:
      "React and Next.js: Building Modern Web Applications  React and Next.js have become pivotal in the world of modern web development, enabling developers to create highly interactive, efficient, and scalable web applications. React, a JavaScript library for building user interfaces, and Next.js, a React framework for server-side rendering and static site generation, together form a powerful combination that addresses various aspects of web application development.  **React: A Foundation for Dynamic Interfaces**  React, developed by Facebook, revolutionized the way developers build user interfaces. It introduces a component-based architecture, allowing developers to create reusable UI components. This modular approach not only simplifies the development process but also enhances maintainability and scalability. React’s virtual DOM efficiently updates and renders only the components that change, leading to improved performance.  React promotes the concept of declarative programming, where developers describe what the UI should look like, and React handles the rendering. This approach contrasts with imperative programming, making the code more predictable and easier to debug. React’s ecosystem is vast, with a plethora of libraries and tools available for state management, routing, and more, making it a versatile choice for building complex web applications.  **Next.js: Enhancing React with Server-Side Rendering**  Next.js, created by Vercel, builds upon React’s strengths by adding server-side rendering (SSR) and static site generation (SSG) capabilities. SSR allows the initial rendering of a web page to occur on the server, resulting in faster load times and improved SEO. SSG, on the other hand, pre-renders pages at build time, ensuring lightning-fast performance for static content.  Next.js also introduces features like automatic code splitting, which optimizes load times by splitting the code into smaller chunks. This means that only the necessary code is loaded initially, reducing the initial load time and improving the overall user experience. Furthermore, Next.js provides a file-based routing system, simplifying the process of defining routes and navigation within an application.  **Integrating React and Next.js: A Seamless Development Experience**  Combining React and Next.js creates a seamless development experience. Developers can leverage React’s component-based architecture and Next.js’s SSR and SSG capabilities to build high-performance, SEO-friendly applications. The integration is straightforward, as Next.js is built on top of React, allowing developers to use their existing React knowledge and skills.  Next.js offers a robust API for data fetching, enabling developers to fetch data at different stages of the application lifecycle. The `getStaticProps` and `getServerSideProps` functions allow for data fetching at build time and request time, respectively. This flexibility ensures that applications can efficiently handle various data fetching scenarios, from static content to dynamic, user-specific data.  **Conclusion: A Powerful Duo for Modern Web Development**  React and Next.js together represent a powerful duo for modern web development. React’s component-based architecture and declarative programming model simplify UI development, while Next.js’s server-side rendering and static site generation capabilities enhance performance and SEO. By integrating these technologies, developers can create highly interactive, efficient, and scalable web applications.  As the web development landscape continues to evolve, React and Next.js remain at the forefront, providing developers with the tools and capabilities needed to build the next generation of web applications. Their combined strengths make them an ideal choice for any developer looking to create fast, reliable, and maintainable web applications.",
  },
];

const RecommendValue = ({ handleClick }: RecommendValueProps) => {
  return (
    <section className="flex w-full items-center justify-center mt-2 gap-4 flex-row flex-wrap">
      {recommendations.map((recommendation, index) => (
        <Button
          size="sm"
          key={index}
          className="bg-neutral-700 rounded-md shadow-md p-2 space-x-1 flex"
          onClick={() => handleClick(recommendation.value)}
        >
          <span className="text-xs">{recommendation.label}</span>
          <MoveUpRight className="h-4 w-4" />
        </Button>
      ))}
    </section>
  );
};

export default RecommendValue;
