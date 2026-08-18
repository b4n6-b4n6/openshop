import createOrders from '../../backend/Orders/index.js';
import notify from './notify.js';
import { ordersVersion } from '../../shared/utils/viewVersions.js';

const ORDER_CHANGES_POLL_INTERVAL = 1000 * 20;
const ORDER_CHANGED_MSG = 'Your orders have updates!';

export default async (pool) => {
  const orders = await createOrders(pool);

  let lastVersion = ordersVersion(await orders.getAllNotifiableForShop());
  setInterval(
    async () => {
      const newVersion = ordersVersion(await orders.getAllNotifiableForShop());

      if (lastVersion !== newVersion) {
        console.log(
          `${(new Date()).toISOString()}`,
          `Notifying... (${lastVersion} -> ${newVersion})`,
        );

        notify(ORDER_CHANGED_MSG);
      }

      lastVersion = newVersion;
    },
    ORDER_CHANGES_POLL_INTERVAL,
  );
};
