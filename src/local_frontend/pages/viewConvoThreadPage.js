import { CONVO_PAGE_REFRESH } from '../../const.js';
import { chatThreadPage } from '../../shared/pages/chatPage.js';

export default ({
  allExtMessages,
  version,
  me,
  chatId,
}) => (
  chatThreadPage({
    allExtMessages,
    me,
    chatId,
    version,
    imageBase: '/shop/convos/images',
    orderBase: '/shop/orders',
    refresh: CONVO_PAGE_REFRESH,
    owner: true,
  })
);
