const createInvoiceUri = ({ depositAddress, amount }) => (
  `monero:${depositAddress}?tx_amount=${amount}`
);
export default createInvoiceUri;
