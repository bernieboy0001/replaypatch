import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  localReporterKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  attest(context: __compactRuntime.CircuitContext<PS>,
         recordingHash_0: Uint8Array,
         patchHash_0: Uint8Array,
         ok_0: boolean,
         salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verify(context: __compactRuntime.CircuitContext<PS>,
         recordingHash_0: Uint8Array,
         patchHash_0: Uint8Array,
         ok_0: boolean,
         salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  attest(context: __compactRuntime.CircuitContext<PS>,
         recordingHash_0: Uint8Array,
         patchHash_0: Uint8Array,
         ok_0: boolean,
         salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verify(context: __compactRuntime.CircuitContext<PS>,
         recordingHash_0: Uint8Array,
         patchHash_0: Uint8Array,
         ok_0: boolean,
         salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  attest(context: __compactRuntime.CircuitContext<PS>,
         recordingHash_0: Uint8Array,
         patchHash_0: Uint8Array,
         ok_0: boolean,
         salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verify(context: __compactRuntime.CircuitContext<PS>,
         recordingHash_0: Uint8Array,
         patchHash_0: Uint8Array,
         ok_0: boolean,
         salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly attestationId: Uint8Array;
  readonly reporter: Uint8Array;
  readonly passed: boolean;
  readonly sequence: bigint;
  readonly domainTag: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
