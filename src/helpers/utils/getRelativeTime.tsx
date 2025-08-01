export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();

  const msInMinute = 1000 * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  if (diff < msInMinute) return "Just now";

  if (diff < msInHour) {
    const mins = Math.floor(diff / msInMinute);
    return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  }

  if (diff < msInDay) {
    const hours = Math.floor(diff / msInHour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(diff / msInDay);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks === 1 ? "1 week ago" : `${weeks} weeks ago`}`;
  }

  const months = Math.floor(days / 30);
  if (months < 12)
    return `${months === 1 ? "1 month ago" : `${months} months ago`}`;

  const years = Math.floor(days / 365);
  return `${years === 1 ? "1 year ago" : `${years} years ago`}`;
};
