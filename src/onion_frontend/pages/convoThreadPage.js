import { CONVO_PAGE_REFRESH } from '../../const.js';
import { chatThreadPage } from '../../shared/pages/chatPage.js';

export default async ({
  allExtMessages,
  version,
  me,
  chatId,
}) => (
  chatThreadPage({
    allExtMessages,
    version,
    me,
    chatId,
    imageBase: '/browser/convo/images',
    orderBase: '/browser/orders',
    refresh: CONVO_PAGE_REFRESH,
  })
);
