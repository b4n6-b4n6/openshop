const floatingXmrToPico = (floatingXmr) => (
  Number(floatingXmr.toFixed(12).replace('.', ''))
);

export default floatingXmrToPico;
