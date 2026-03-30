import classNames from 'classnames';
import { ReactNode, Suspense } from 'react';
import { ClipLoader } from 'react-spinners';

function Spinner({ size }: { size?: number }) {
  return <ClipLoader size={size} aria-label='Loading Spinner' data-testid='loader' color='#fff' />;
}

Spinner.Centered = ({ size, className }: { size?: number; className?: string }) => (
  <div className={classNames('flex items-center justify-center py-6', className)}>
    <Spinner size={size} />
  </div>
);

Spinner.Suspense = ({ children, className }: { children: ReactNode; className?: string }) => (
  <Suspense
    fallback={
      <div className={classNames('flex items-center justify-center', className)}>
        <Spinner />
      </div>
    }
  >
    {children}
  </Suspense>
);

export default Spinner;
