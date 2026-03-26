const DEFAULT_LOCALE = "fr-FR";
const DEFAULT_CURRENCY = "TND";
const DEFAULT_TIMEZONE = "Africa/Tunis";

function isValidDate(date: Date) {
  return !Number.isNaN(date.getTime());
}

function toDate(value: string | number | Date) {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
  locale = DEFAULT_LOCALE
) {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: "medium",
    ...options,
  }).format(date);
}

export function formatDateTime(
  value: string | number | Date,
  locale = DEFAULT_LOCALE
) {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    timeZone: DEFAULT_TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatTime(
  value: string | number | Date,
  locale = DEFAULT_LOCALE
) {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    timeZone: DEFAULT_TIMEZONE,
    timeStyle: "short",
  }).format(date);
}

export function formatRelativeTime(
  value: string | number | Date,
  locale = DEFAULT_LOCALE
) {
  const date = toDate(value);

  if (!isValidDate(date)) {
    return "-";
  }

  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);

  let unit: Intl.RelativeTimeFormatUnit = "second";
  let amount = diffInSeconds;

  if (absSeconds >= 60 && absSeconds < 3600) {
    unit = "minute";
    amount = Math.round(diffInSeconds / 60);
  } else if (absSeconds >= 3600 && absSeconds < 86400) {
    unit = "hour";
    amount = Math.round(diffInSeconds / 3600);
  } else if (absSeconds >= 86400 && absSeconds < 2592000) {
    unit = "day";
    amount = Math.round(diffInSeconds / 86400);
  } else if (absSeconds >= 2592000 && absSeconds < 31536000) {
    unit = "month";
    amount = Math.round(diffInSeconds / 2592000);
  } else if (absSeconds >= 31536000) {
    unit = "year";
    amount = Math.round(diffInSeconds / 31536000);
  }

  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    amount,
    unit
  );
}

export function formatCurrency(
  value: number,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(
  value: number,
  locale = DEFAULT_LOCALE,
  options?: Intl.NumberFormatOptions
) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatPercent(
  value: number,
  locale = DEFAULT_LOCALE,
  fractionDigits = 0
) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  const normalizedValue = value > 1 ? value / 100 : value;

  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(normalizedValue);
}

export function formatPhoneNumber(phone: string) {
  if (!phone?.trim()) {
    return "-";
  }

  return phone.replace(/\s+/g, " ").trim();
}

export function formatDuration(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "-";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function formatCompactDuration(totalMinutes: number) {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) {
    return "-";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}min`;
}

export function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "-";
  }

  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / 1024 ** unitIndex;
  const decimals = value >= 10 || unitIndex === 0 ? 0 : 1;

  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

export function truncateText(value: string, maxLength = 80) {
  if (!value) {
    return "";
  }

  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

export function getInitials(name: string) {
  if (!name?.trim()) {
    return "";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}