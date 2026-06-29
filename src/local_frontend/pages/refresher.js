const REFRESH = 2;

const refresher = ({ url } = {}) => (
  `<meta http-equiv="refresh" content="${
    url ? `${`${REFRESH}; URL=${url}`}` : REFRESH
  }">`
);

export default refresher;
