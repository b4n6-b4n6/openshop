import { formatDistanceToNow } from 'date-fns';

export default (date) => (
  formatDistanceToNow(
    date,
    {
      addSuffix: true,
      includeSeconds: true,
    },
  )
);
