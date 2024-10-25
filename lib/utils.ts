/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getTimestamp = (createdAt: Date): string => {
  const now = new Date();
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};


export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export const getJoinedDate = (date: Date): string => {
  // Extract the month and year from the Date object
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  // Create the joined date string (e.g., "September 2023")
  const joinedDate = `${month} ${year}`;

  return joinedDate;
}

interface URLParams {
  params : string;
  key : string;
  value : string | null;
}
// ye function hamare currnet url ko lega or usme dekhega kya kya hai or un sabko nahi change krega sirf key means 'q' ko bs modify krega

export async function formUrlQuery({ params, key, value }: URLParams): Promise<string> {
  const currentURL = qs.parse(params);

  // Ensure currentURL is an object and key is set correctly
  if (typeof currentURL === 'object') {
    currentURL[key] = value;
  }

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentURL as Record<string, any>,
  }, { skipNull: true });
}



interface RemoveUrlKeyProps {
  params: string;
  keys: string[];
}

export async function removeKeysFromUrl({ params, keys }: RemoveUrlKeyProps): Promise<string> {
  const currentURL = qs.parse(params);

  // Ensure keys exist before deleting them
  keys.forEach((key) => {
    if (key in currentURL) {
      delete currentURL[key];
    }
  });

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: currentURL as Record<string, any>,
  }, { skipNull: true });
}