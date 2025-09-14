import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';

export default function FormWatcher({
  submitted,
  onDone,
}: Readonly<{ submitted: boolean; onDone: () => void }>) {
  const { pending } = useFormStatus();
  useEffect(() => {
    if (!pending && submitted) {
      onDone();
    }
  }, [pending, submitted, onDone]);
  return null;
}
