import React from 'react';
import { Card, Button } from '@/components/UI';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker flex items-center justify-center px-4">
      <Card className="text-center max-w-md">
        <div className="text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button fullWidth variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Custom404;
