import formatPiconero from '../../../utils/formatPiconero.js';

export default ({
  amount,
  subaddressIndex,
  isConfirmed,
  isLocked,
  txid,
  isOutgoing,
}) => {
  const log = (...args) => {
    console.log(
      ...args,
      `(isConfirmed=${isConfirmed}, isLocked=${isLocked}, txid=${txid})`,
    );
  };

  if (isOutgoing) {
    log('Is outgoing');
    return;
  }

  log(`Incoming ${formatPiconero(amount)} XMR at subaddress ${subaddressIndex}`);

  if (isConfirmed === false && isLocked === true) {
    // ... implement "INCOMING TRANSACTION DETECTED"
  } else if (isConfirmed === true && isLocked === false) {
    // ... implement "INCOMING TRANSACTION CONFIRMED"
  }
};
