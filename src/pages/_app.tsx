import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0A0E27',
            color: '#fff',
            border: '1px solid rgba(125, 58, 255, 0.3)',
          },
        }}
      />
    </>
  );
}

export default App;
