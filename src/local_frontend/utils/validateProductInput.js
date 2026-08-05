const MAX_PRODUCT_PRICE = 999.99;
const MAX_PRODUCT_QUANTITY = 2147483647;

const validateProductInput = ({ price, available_quantity }) => {
  const priceNumber = Number(price);
  if (!Number.isFinite(priceNumber) || priceNumber <= 0 || priceNumber > MAX_PRODUCT_PRICE) {
    return 'Price must be greater than 0 and no more than 999.99.';
  }

  const quantityNumber = Number(available_quantity);
  if (
    !Number.isInteger(quantityNumber)
    || quantityNumber < 0
    || quantityNumber > MAX_PRODUCT_QUANTITY
  ) {
    return 'Available quantity must be a whole number between 0 and 2,147,483,647.';
  }

  return null;
};

export default validateProductInput;
