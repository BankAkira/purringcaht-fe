// import (Internal imports)

// helper functions
// import { Logger } from '../../../helper/logger.ts';

// components
import PointsDisplay from '../components/PointsDisplay.tsx';
import ServicesGrid from '../components/ServicesGrid.tsx';
import SlideImg from '../components/SlideImg.tsx';

// const log = new Logger('UserOverviewSection');

export default function UserOverviewSection() {
  return (
    <section>
      <div className="flex flex-col gap-6 p-6 pb-36">
        <PointsDisplay />
        <ServicesGrid />
        <SlideImg />
      </div>
    </section>
  );
}
