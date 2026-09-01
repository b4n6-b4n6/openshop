import formatPiconero from '../../../utils/formatPiconero.js';

const deriveTxState = ({ isConfirmed, isLocked }) => (
  false
  || (isConfirmed === false && isLocked === true) && 'DETECTED'
  || (isConfirmed === true && isLocked === true) && 'CONFIRMED'
  || (isConfirmed === true && isLocked === false) && 'UNLOCKED'
);

const mark = ({
  orders, amount, isConfirmed, isLocked,
}) => {
  const txState = deriveTxState({ isConfirmed, isLocked });

  if (txState === 'DETECTED' || txState === 'CONFIRMED') {
    return orders.markDepositDetected({ deposit_amount: amount });
  } if (txState === 'UNLOCKED') {
    return orders.markDepositConfirmed({ deposit_amount: amount });
  }

  throw new Error('undefined branch');
};

const log = (message, { isConfirmed, isLocked, txid }) => {
  console.log(
    `${(new Date()).toISOString()}`,
    message,
    `(isConfirmed=${isConfirmed}, isLocked=${isLocked}, txid=${txid})`,
  );
};

export default async ({
  amount,
  subaddressIndex,
  isConfirmed,
  isLocked,
  txid,
  isOutgoing,
  orders,
  products,
}) => {
  const logParams = { isConfirmed, isLocked, txid };

  if (isOutgoing) { log('Tx is outgoing', logParams); return; }
  if (subaddressIndex !== 0) { log('Tx has bad subadress', logParams); return; }

  const marked = await mark({
    amount, isConfirmed, isLocked, orders,
  });

  if (marked) {
    log(`Tx with ${formatPiconero(amount)} XMR processed`, logParams);

    const txid_updated = await orders.setDepositTxid({
      deposit_amount: amount,
      deposit_txid: txid,
    });

    if (txid_updated) {
      const productDetails = await orders.getProductDetails(txid_updated);

      if (productDetails) {
        const { product_id, purchase_quantity } = productDetails;
        await products.reduceAvailableQuantity({
          id: product_id,
          available_quantity_delta: purchase_quantity,
        });
      }
    }
  } else {
    log(`Tx with ${formatPiconero(amount)} XMR not processed`, logParams);
  }
};
