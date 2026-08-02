const refresher = ({ url, interval = 2 } = {}) => (
  url
    ? `<meta http-equiv='refresh' content='${interval}; URL=${url}'>`
    : `<meta http-equiv='refresh' content='${interval}'>`
);

export default refresher;
