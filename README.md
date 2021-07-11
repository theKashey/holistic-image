# holistic-image

> Holism is the idea that various __systems should be viewed as wholes__, not merely as a collection of parts. 

Build-time Automatic image transformation and Holistic management

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
// generate-images.js
import {deriveHolisticImages} from "holistic-image/api";

deriveHolisticImages(
/root folder*/ process.argv[2],
/*mask*/ process.argv[3],
// /*optional*/ squoosh ecoders with options
)
```
+
```
// package.json
 "autogen:images": "yarn generate-images.js $INIT_CWD 'src/**/*'",
```

- via CLI

```
// package.json
"autogen:images":"yarn node_modules/holistic-image/cli $INIT_CWD 'src/**/*'"
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
import image from './image.holistic.jpg';
import imageXS from './imageXS.holistic.jpg';

<Image src={image} media={{ 'max-width: 600px': imageXS }} />;
// 👇 6-12 images generated, the right picked, completely transparent
```

## Type Script integration

While this library provides `d.ts` for the file extension it can be more beneficial
to provide your own ones, as you did for `.jpg` and other static asses already

```ts
declare module '*.holistic.jpg' {
  import type { HolisticalImageDefinition } from 'holistic-image';

  const content: HolisticalImageDefinition;
  export default content;
}
```
# See also
- [imagemin](https://github.com/imagemin/imagemin) (unmaintaned) the same _defiving_ mechanics, with no further management
- [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) not creates, but optimizes existing images
- [nextjs/image](https://nextjs.org/docs/api-reference/next/image) serves optimized image via CDN transformation

# License

MIT
