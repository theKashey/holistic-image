/// <reference types="node" />
declare type Writeable = string | Buffer;

export declare const derivedFiles: (
  source: string,
  targets: string[],
  generator: (data: Buffer, missingTargets: string[]) => Promise<Record<string, Promise<Writeable> | Writeable>>,
  options?: {
    era?: Date;
  }
) => Promise<void[]>;
export {};
