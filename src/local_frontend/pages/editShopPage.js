import {
  photoField,
  richEditor,
} from '../../shared/pages/components.js';
import {
  appFrame,
  button,
  document,
  field,
  icon,
} from '../../shared/pages/layout.js';
import indicators from './indicators.js';

const editShopPage = ({
  name,
  description,
  profile_photo,
  banner_photo,
}) => document({
  title: 'Edit Shop',
  scripts: ['editor.js', 'owner.js', 'sound.js'],
  body: appFrame({
    title: 'Edit Shop',
    titleIcon: icon('store', 'size-4'),
    back: '/shop',
    status: indicators(),
    content: (
      `<div class="space-y-5 px-5 py-6">
        <form
          id="shop-details-form"
          action="/shop/settings"
          method="post"
          data-disable-on-submit
          class="space-y-5"
        >
          ${field({
            label: 'Shop name',
            name: 'name',
            value: name,
            placeholder: 'My Shop',
            attributes: 'required',
          })}
          ${richEditor({ value: description, label: 'Shop description' })}
        </form>

        <form
          action="/shop/settings/profile-photo"
          method="post"
          enctype="multipart/form-data"
          data-disable-on-submit
        >
          ${photoField({
            label: 'Profile photo',
            value: profile_photo,
            autoSubmit: true,
          })}
        </form>

        <form
          action="/shop/settings/banner-photo"
          method="post"
          enctype="multipart/form-data"
          data-disable-on-submit
        >
          ${photoField({
            label: 'Banner photo',
            value: banner_photo,
            aspect: 'banner',
            autoSubmit: true,
          })}
        </form>
      </div>`
    ),
    bottom: button({
      label: 'Update',
      type: 'submit',
      attributes: 'form="shop-details-form"',
    }),
  }),
});

export default editShopPage;
