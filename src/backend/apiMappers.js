const bufferToDataUrl = (value) => (
  value ? value.toString('utf8') : undefined
);

export const dataUrlToBuffer = (value) => (
  typeof value === 'string' && value.length > 0
    ? Buffer.from(value, 'utf8')
    : null
);

export const toShop = (shop, address) => ({
  onion: address,
  name: shop?.name ?? 'My Shop',
  description: shop?.description ?? '',
  profilePhoto: bufferToDataUrl(shop?.profile_photo),
  bannerPhoto: bufferToDataUrl(shop?.banner_photo),
  currency: 'USD',
});

export const toProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description ?? '',
  photo: bufferToDataUrl(product.photo),
  currency: product.currency.toUpperCase(),
  price: Number(product.price),
  quantity: product.available_quantity,
});

export const fromProduct = (product) => ({
  name: product.name,
  description: product.description ?? '',
  photo: dataUrlToBuffer(product.photo),
  currency: product.currency.toLowerCase(),
  price: product.price,
  available_quantity: product.quantity,
});

export const toChat = (chat) => ({
  id: chat.id,
  lastMessageAt: new Date(chat.last_message_at).getTime(),
  unread: chat.unread,
});

export const toMessage = (message, me, myRole) => {
  const otherRole = myRole === 'owner' ? 'customer' : 'owner';

  return {
    id: message.id,
    chatId: message.sender === me ? message.receiver : message.sender,
    from: message.sender === me ? myRole : otherRole,
    type: message.image_content ? 'image' : 'text',
    text: message.text_content ?? undefined,
    media: bufferToDataUrl(message.image_content),
    createdAt: new Date(message.created_at).getTime(),
  };
};
