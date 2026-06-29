const APP_TIME_ZONE = "America/Sao_Paulo";

const parseDate = (date: string) => {
  const hasTimeZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(date);

  return new Date(hasTimeZone ? date : `${date}Z`);
};

export const formatDateBR = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(parseDate(date));

export const formatTimeBR = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeStyle: "medium",
    timeZone: APP_TIME_ZONE,
  }).format(parseDate(date));

export const formatDateTimeBR = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: APP_TIME_ZONE,
  }).format(parseDate(date));

export const formatShortDateTimeBR = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: APP_TIME_ZONE,
  }).format(parseDate(date));
