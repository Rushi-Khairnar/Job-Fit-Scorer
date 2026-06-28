# Job-Fit-Scorer

Job-Fit-Scorer is an intelligent talent-to-role matching application. It helps users discover their ideal career paths by analyzing their current skill sets against industry requirements, calculating semantic match scores, and providing personalized learning roadmaps to bridge any skill gaps.

## Features

- **Resume Parsing:** Upload your resume (PDF, DOCX, or TXT) to automatically extract your core technical skills.
- **Manual Entry:** Manually select or type your skills if you prefer not to upload a resume.
- **AI-Powered Matching:** Analyzes your skills against a comprehensive directory of roles to find the best career fits using similarity scores.
- **Skill Gap Analysis:** Highlights exact matching skills and identifies missing foundational skills for your targeted roles.
- **Visual Analytics:** Interactive radar charts map your proficiency against the ideal candidate profile for a given role.
- **Learning Roadmaps:** Provides curated step-by-step learning paths with quick links to tutorials for any missing skills.
- **Dark Mode Support:** Fully responsive dark/light mode toggle for a better user experience.
- **Career Directory:** Browse a global directory of tech roles, average salaries, and core requirements.

## Tech Stack

- **Frontend Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Animations:** Motion (Framer Motion)
- **Data Visualization:** Recharts
- **Document Processing:** PDF.js (for PDFs), Mammoth (for DOCX)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Job-Fit-Scorer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured to be automatically deployed to GitHub pages via GitHub Actions. Whenever you push to the `main` or `master` branch, the `.github/workflows/deploy.yml` workflow will build and deploy the application.

Make sure your repository has GitHub Pages enabled (under Settings > Pages) and set to use GitHub Actions as the deployment source.
