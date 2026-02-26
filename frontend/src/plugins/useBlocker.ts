import { Transition } from 'history';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from '@/providers/contexts/historyContext.ts';

export type BlockerState = 'idle' | 'blocked' | 'proceeding';

export interface CustomBlocker {
  state: BlockerState;
  reset: () => void;
  proceed: () => void;
}

export function useBlocker(when: boolean): CustomBlocker {
  const history = useHistory();
  const [state, setState] = useState<BlockerState>('idle');

  const txRef = useRef<Transition | null>(null);
  const unblockRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!when || !history) {
      setState('idle');
      return;
    }

    const unblock = history.block((transition: Transition) => {
      txRef.current = transition;
      unblockRef.current = unblock;
      setState('blocked');
    });

    return () => {
      unblock();
    };
  }, [history, when]);

  const proceed = useCallback(() => {
    if (txRef.current && unblockRef.current) {
      setState('proceeding');

      unblockRef.current();
      txRef.current.retry();

      txRef.current = null;
      unblockRef.current = null;
      setState('idle');
    }
  }, []);

  const reset = useCallback(() => {
    txRef.current = null;
    unblockRef.current = null;
    setState('idle');
  }, []);

  return { state, reset, proceed };
}
