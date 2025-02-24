"use client";

import { MoreHorizontal } from "lucide-react";
import { Plus } from "lucide-react";
import React, { useEffect, useRef, forwardRef, useState } from "react";
import { Button } from "./ui/button";
import { Minus } from "lucide-react";
import { LayoutGrid } from "lucide-react";

// ================================
// ResumeContent Component
// ================================
// This component builds the resume content dynamically and forwards the ref for printing.
interface ResumeContentProps {
  data: any;
}

const ResumeContent = forwardRef<HTMLDivElement, ResumeContentProps>(
  ({ data }, ref) => {
    // -------------------------------------------------------------------
    // Build and paginate the resume after the component mounts.
    // Browser-dependent helper functions are now defined inside useEffect.
    // -------------------------------------------------------------------
    useEffect(() => {
      const container = (ref as React.MutableRefObject<HTMLDivElement>).current;
      if (!container) return;

      // Helper: Create a new page container.
      const createPage = () => {
        const page = document.createElement("div");
        page.className = "page";
        return page;
      };

      // Helper: Pagination - Move each content block into pages.
      const paginateContent = (
        contentContainer: HTMLElement,
        container: HTMLElement
      ) => {
        container.innerHTML = "";

        // Get all blocks built in contentContainer.
        const blocks = Array.from(contentContainer.children) as HTMLElement[];

        // Start with one new page.
        let currentPage = createPage();
        container.appendChild(currentPage);

        blocks.forEach((block) => {
          // Append the block to the current page.
          currentPage.appendChild(block);

          // If the content now overflows the page…
          if (currentPage.scrollHeight > currentPage.clientHeight) {
            // Remove the block from the current page.
            currentPage.removeChild(block);
            // Create a new page.
            currentPage = createPage();
            container.appendChild(currentPage);
            // And add the block there.
            currentPage.appendChild(block);
          }
        });
      };

      // Helper: Build the resume content as separate blocks.
      const buildResumeContent = (data: any) => {
        const contentContainer = document.createElement("div");

        // Header block
        const headerBlock = document.createElement("div");
        headerBlock.className = "header";
        headerBlock.innerHTML = `
          <div class="name">${data.personal_info.name}</div>
          <div class="contact">
            ${data.personal_info.email} | ${data.personal_info.phone} | ${data.personal_info.location}<br/>
            <a href="${data.personal_info.linkedin}" target="_blank">LinkedIn</a> |
            <a href="${data.personal_info.portfolio}" target="_blank">Portfolio</a>
          </div>
        `;
        contentContainer.appendChild(headerBlock);

        // Professional Summary block
        const summaryBlock = document.createElement("div");
        summaryBlock.className = "section";
        summaryBlock.innerHTML = `
          <div class="section-title">Professional Summary</div>
          <div class="section-content splittable">${data.professional_summary}</div>
        `;
        contentContainer.appendChild(summaryBlock);

        // Work Experience section title block
        const workTitleBlock = document.createElement("div");
        workTitleBlock.className = "section";
        workTitleBlock.innerHTML = `<div class="section-title">Work Experience</div>`;
        contentContainer.appendChild(workTitleBlock);

        // Work Experience items
        data.work_experience.forEach((exp: any) => {
          // Work Experience Header Block
          const workHeaderBlock = document.createElement("div");
          workHeaderBlock.className = "work-item-header section";
          workHeaderBlock.innerHTML = `
            <div class="item-header">${exp.role} – ${exp.company}</div>
            <div class="item-subheader">${exp.start_date} to ${exp.end_date} | ${exp.location}</div>
          `;
          contentContainer.appendChild(workHeaderBlock);

          // Responsibility Blocks
          exp.responsibilities.forEach((resp: any) => {
            const responsibilityBlock = document.createElement("div");
            responsibilityBlock.className = "work-item-responsibility section";
            const respText =
              typeof resp === "object" && resp.text ? resp.text : resp;
            responsibilityBlock.innerHTML = `
              <ul class="responsibilities">
                <li class="splittable">${respText}</li>
              </ul>
            `;
            contentContainer.appendChild(responsibilityBlock);
          });
        });

        // Education block
        const eduBlock = document.createElement("div");
        eduBlock.className = "section";
        eduBlock.innerHTML = `
          <div class="section-title">Education</div>
          <div class="education-item">
            <div class="item-header">${data.education.degree}</div>
            <div class="item-subheader">
              ${data.education.university}, ${data.education.location} | Graduating: ${data.education.graduation_date}
            </div>
            <div class="section-content splittable">${data.education.scholarship}</div>
          </div>
        `;
        contentContainer.appendChild(eduBlock);

        // Skills block
        const skillsBlock = document.createElement("div");
        skillsBlock.className = "section";
        skillsBlock.innerHTML = `
          <div class="section-title">Skills</div>
          <div class="section-content splittable">${data.skills.join(", ")}</div>
        `;
        contentContainer.appendChild(skillsBlock);

        return contentContainer;
      };

      // Build and paginate the resume.
      const content = buildResumeContent(data);
      paginateContent(content, container);
    }, [ref, data]);

    return <div id="resume-container" ref={ref}></div>;
  }
);

ResumeContent.displayName = "ResumeContent";

// ================================
// ResumeView Component
// ================================
interface ResumeViewProps {
  data: any;
  allignment: boolean;
}

export default function ResumeView({ data, allignment }: ResumeViewProps) {
  // Ref for the resume content
  const resumeContentRef = useRef<HTMLDivElement>(null);
  // Ref for the outer container that determines available width.
  const containerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------
  // Added state for controlling zoom manually.
  // -------------------------------------------------------------------
  const [userZoom, setUserZoom] = useState(1);

  // Effect to compute and apply scaling so that the resume fits its container.
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const resumeEl = document.getElementById("resume-container");
      if (container && resumeEl) {
        // Base width for the resume (set this to your resume's natural width)
        const baseWidth = 793.7;
        // Get the available width of the container.
        const availableWidth = container.clientWidth;
        // Calculate the scale factor including the manual zoom.
        const scale = (availableWidth / baseWidth) * userZoom;
        resumeEl.style.transform = `scale(${scale})`;
        // Set transform origin so scaling occurs from the top left
        if (allignment) {
          resumeEl.style.transformOrigin = "top center";
        } else {
          resumeEl.style.transformOrigin = "top center";
        }
        // Adjust the height of the container's parent (if needed) so that the scaled resume is fully visible.
        const scaledHeight = resumeEl.scrollHeight * scale;
        if (resumeEl.parentElement) {
          resumeEl.parentElement.style.height = `${scaledHeight}px`;
        }
      }
    };

    // Initial call and add a resize listener.
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userZoom]); // add userZoom as a dependency

  return (
    <div className="bg-gray-100 rounded-xl shadow-sm max-h-screen overflow-hidden flex flex-col">
      <header className="flex items-center justify-between mx-20 px-4 py-2 bg-white border-b rounded-bl-[15px] rounded-br-[15px]">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
            <LayoutGrid className="h-5 w-5 mr-2" />
            Select template
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-700 hover:bg-gray-100"
            onClick={() => setUserZoom(prev => Math.max(prev - 0.1, 0.1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-gray-700 text-xl">Aa</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-700 hover:bg-gray-100"
            onClick={() => setUserZoom(prev => prev + 0.1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Download PDF</Button>
          <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </header>
      {/* Inline styles */}
      <style>{`
        /* For print, force A4 pages */
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          background: #f4f4f4;
          margin: 0;
          padding: 0;
          overflow-x: hidden; /* Ensure global horizontal scrolling is disabled */
        }
        /* Each .page simulates an A4 page on–screen. */
        .page {
          width: 210mm;
          height: 1122px;
          margin: 10mm auto;
          background: #fff;
          padding: 20mm;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          border: 1px solid #ddd;
        }
        /* Header styling */
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header .name {
          font-size: 32px;
          font-weight: bold;
        }
        .header .contact {
          font-size: 14px;
          margin-top: 5px;
        }
        /* Section styling */
        .section {
          margin-bottom: 15px;
        }
        .section-title {
          font-size: 18px;
          margin-bottom: 5px;
          padding-bottom: 3px;
          border-bottom: 2px solid #333;
        }
        .section-content {
          font-size: 12px;
          line-height: 1.4;
        }
        /* Work and education item styling */
        .work-item-header,
        .education-item {
          margin-bottom: 10px;
        }
        .item-header {
          font-size: 14px;
          font-weight: bold;
        }
        .item-subheader {
          font-size: 12px;
          font-style: italic;
          margin-bottom: 5px;
        }
        ul.responsibilities {
          list-style-type: disc;
          margin: 0px 0;
          padding-left: 20px;
          font-size: 12px;
          line-height: 0.75;
        }
        ul.responsibilities li {
          margin-bottom: 0;
          line-height: 1;
        }
        .section-content, ul.responsibilities li {
          word-break: normal;
          overflow-wrap: normal;
          hyphens: none;
        }
        .splittable {}
        /* Print rules */
        @media print {
          body { background: none; }
          .page {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
          }
          .no-print { display: none; }
          #resume-container {
            transform: none !important;
          }
        }
        .work-item-responsibility.section {
          margin-bottom: 5px;
        }
      `}</style>

      {/* Updated container that scrolls vertically without horizontal scrolling.
          Added a maxHeight so that the content is bounded vertically. */}
      <div
        ref={containerRef}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
          maxHeight: "calc(100vh - 40px)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ResumeContent ref={resumeContentRef} data={data} />
      </div>
    </div>
  );
}
