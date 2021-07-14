# holistic-image

> Holism is the idea that various **systems should be viewed as wholes**, not merely as a collection of parts.

Build-time Automatic image transformation and Holistic management

- 🍊 uses [squoosh](https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh) to derive jpg, webp, avif from your
  sources
- 📦 hides implementation details behind Webpack
- 🤖 on demand file creation, and CLI utils to verify integrity
- ⚛️ optional React implementation

# Structure

This is a _convention over configuration_ library, and all you need is to follow our convention

Having ➡️

```
├── image@2x.holistic.png
```

️Will produce ⬇️

```
├── image@2x.holistic.png
├── .holistic (you can hide this directory)
│   └─ image@2x
│      ├─ derived.image@1x.jpg
│      ├─ derived.image@1x.webp
│      ├─ derived.image@1x.avif
│      ├─ derived.image@2x.jpg
│      ├─ derived.image@2x.webp
│      ├─ derived.image@2x.avif
│      └─ derived.image@2x.meta.js
```

The same principle will be applied during the import - instead of importing `image@2x.holistic.png` you will get a
pointer to all files below

# Usage

## Step 1 - derive files

`holistic-image` is looking for files named accordingly - `image.holistic.png`(or jpg) and **derives**
the "missing" ones - optimized `jpg`, `webp` and `avif`

If the source file named as `image@2x.jpg`(Figma standard), then `@1x` version will be generated automatically

### How to use

- via Webpack loader Just use webpack loader with `autogenerate` option enabled (default)
- via API

```ts
// generate-images.js
import {deriveHolisticImages} from "holistic-image/api";

deriveHolisticImages(
  /root folder*/
process.argv[2],
  /*mask*/ process.argv[3],
// /*optional*/ squoosh ecoders with options
)
```

And then in `package.json`

```
// package.json
 "autogen:images": "yarn generate-images.js $INIT_CWD 'src/**/*'",
```

- via CLI

```
// package.json
"autogen:images":"holistic-image derive  $INIT_CWD 'src/**/*'"
"validate:images":"holistic-image validate  $INIT_CWD 'src/**/*'"
```

## Step 2 - configure webpack to process images

- Optimized config, will remove originals from the final bundle

```ts
import { holisticImage } from 'holistic-image/webpack';

webpack.config = {
  module: {
    rules: {
      oneOf: [holisticImage, yourFileLoader],
      // .. rest of your config
    },
  },
};
```

- Easy config (for storybook for example), everything will work as well

```ts
import { holisticImage } from 'holistic-image/webpack';

webpack.config = {
  module: {
    rules: {
      holisticImage,
      yourFileLoader,
      // .. and rest of your config
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

While this library provides `d.ts` for the file extension it can be more beneficial to provide your own ones, as you did
for `.jpg` and other static asses already

```ts
declare module '*.holistic.jpg' {
  import type { HolisticalImageDefinition } from 'holistic-image';

  const content: HolisticalImageDefinition;
  export default content;
}
```

# Hiding .holistic output files

folders starting from `.` already expected to be hidden for IDE, but keep in mind - derived files are **expected to be
commited**.

## WebStorm/IDEA

You can use [idea-exclude] to automaticaly configure Idea-based solutions to _exclude_ these folders

- run `idea-exclude holistic-images "src/**/.holistic"`

## VCS

```
"files.exclude": {
    "**/.holistic": true
}
```

# See also

- [imagemin](https://github.com/imagemin/imagemin) (unmaintaned) the same _defiving_ mechanics, with no further
  management
- [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) not creates, but optimizes existing images
- [nextjs/image](https://nextjs.org/docs/api-reference/next/image) serves optimized image via CDN transformation

# License

MIT
