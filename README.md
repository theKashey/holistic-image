# holistic-image

Automatic image transformation and holistic management

- 🍊 uses [squoosh](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh) to derive jpg, webp, avif from your
  sources
- 📦 hides implementation details behind Webpack
- ⚛️ optional React implementation

# Usage

## Step 1 - derive files

`holistic-image` is looking for files named accordingly - `image.holistic.png`(or jpg) and **derives**
the "missing" ones - optimized `jpg`, `webp` and `avif`

If the source file named as `image@2x.jpg`(Figma standard), then `@1x` version will be generated automatically

### How to use

- via API

```ts
import {deriveHolisticImages} from "holistic-image/api";

deriveHolisticImages(/root folder*/
process.argv[2], /*mask*/ process.argv[3]
)
;

// like
// "autogen:images": "yarn generate-images.js $INIT_CWD 'src/**/*'",
```

- via CLI

```ts
"autogen:images"
:
"yarn node_modules/holistic-image/cli $INIT_CWD 'src/**/*'"
```

## Step 2 - configure webpack to process images

```ts
import { holisticImage } from 'holistic-image/webpack';

webpack.config = {
  module: {
    rules: {
      holisticImage,
      // .. rest of your config
    },
  },
};
```

## Step 3 - use

```ts
import image from './image.holistic.jpg';
// ^ not an image, but HolisticalImageDefinition
image = {
  base: [1x, 2x],
  webp: [1x, 2x],
  avif: [1x, 2x],
  [META]: {width, height}
}
```

### Build in React component

```tsx
import { Image } from 'holistical-image/react';

<Image src={image} media={{ 'max-width: 600px': imageXS }} />;
```

# License

MIT
