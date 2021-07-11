import type { HolisticalImageDefinition } from './dist/es2019/types';

declare module '*.holistic.jpg' {
  const content: HolisticalImageDefinition;
  export default content;
}

declare module '*.holistic.png' {
  const content: HolisticalImageDefinition;
  export default content;
}
