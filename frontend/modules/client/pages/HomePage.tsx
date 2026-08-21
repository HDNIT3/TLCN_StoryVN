import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedStories from '../components/home/FeaturedStories';
import RecentUpdates from '../components/home/RecentUpdates';
import RankingChart from '../components/home/RankingChart';
import QuickStats from '../components/home/QuickStats';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT/CENTER 3 COLS: FEATURED & UPDATES */}
          <div className="lg:col-span-3 space-y-12">
            <FeaturedStories />
            <RecentUpdates />
          </div>

          {/* RIGHT 1 COL: RANKING CHART & STATS */}
          <div className="space-y-6">
            <RankingChart />
            <QuickStats />
          </div>

        </div>
      </div>
    </>
  );
}
