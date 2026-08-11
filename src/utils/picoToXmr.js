const picoToXmr = (pico) => (
  (Number(pico) / 1e12).toFixed(12)
);

export default picoToXmr;
