export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  // Zeitdifferenz in Millisekunden
  const diffMs = now.getTime() - date.getTime();
  
  // Umrechnungen
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Logik für die Rückgabe
  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  if (diffHours < 24)   return diffHours === 1 ? "about 1 hour ago" : `about ${diffHours} hours ago`;
  if (diffDays < 7)     return diffDays === 1 ? "about 1 day ago" : `about ${diffDays} days ago`;
  if (diffWeeks < 4)    return diffWeeks === 1 ? "about 1 week ago" : `about ${diffWeeks} weeks ago`;
  if (diffMonths < 12)  return diffMonths === 1 ? "about 1 month ago" : `about ${diffMonths} months ago`;
  
  return diffYears === 1 ? "about 1 year ago" : `about ${diffYears} years ago`;
}