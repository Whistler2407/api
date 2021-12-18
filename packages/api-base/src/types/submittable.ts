// Copyright 2017-2021 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { AccountId, Address, ApplyExtrinsicResult, DispatchError, DispatchInfo, EventRecord, Extrinsic, ExtrinsicStatus, Hash, RuntimeDispatchInfo } from '@polkadot/types/interfaces';
import type { AnyFunction, AnyNumber, AnyTuple, Callback, CallBase, Codec, IExtrinsicEra, IKeyringPair, ISubmittableResult, Signer } from '@polkadot/types/types';
import type { ApiTypes, PromiseOrObs } from './base';

export type AddressOrPair = IKeyringPair | string | AccountId | Address;

export type AugmentedSubmittable<T extends AnyFunction, A extends AnyTuple = AnyTuple> = T & CallBase<A>;

export interface SignerOptions {
  blockHash: Uint8Array | string;
  era?: IExtrinsicEra | number;
  nonce: AnyNumber | Codec;
  signer?: Signer;
  tip?: AnyNumber;
  assetId?: AnyNumber;
}

export type SubmittableDryRunResult<ApiType extends ApiTypes> =
  ApiType extends 'rxjs'
    ? Observable<ApplyExtrinsicResult>
    : Promise<ApplyExtrinsicResult>;

export interface SubmittableExtrinsicFunction<ApiType extends ApiTypes, A extends AnyTuple = AnyTuple> extends CallBase<A> {
  (...params: any[]): SubmittableExtrinsic<ApiType>;
}

export interface SubmittableModuleExtrinsics<ApiType extends ApiTypes> {
  // only with is<Type> augmentation
  [index: string]: SubmittableExtrinsicFunction<ApiType>; // | AugmentedIsSubmittable<ApiType, AnyTuple>;
}

export type SubmittablePaymentResult<ApiType extends ApiTypes> =
  ApiType extends 'rxjs'
    ? Observable<RuntimeDispatchInfo>
    : Promise<RuntimeDispatchInfo>;

export type SubmittableResultResult<ApiType extends ApiTypes, R extends ISubmittableResult = ISubmittableResult> =
  ApiType extends 'rxjs'
    ? Observable<R>
    : Promise<Hash>;

export type SubmittableResultSubscription<ApiType extends ApiTypes, R extends ISubmittableResult = ISubmittableResult> =
  ApiType extends 'rxjs'
    ? Observable<R>
    : Promise<() => void>;

export interface SubmittableResultValue {
  dispatchError?: DispatchError;
  dispatchInfo?: DispatchInfo;
  events?: EventRecord[];
  internalError?: Error;
  status: ExtrinsicStatus;
}

export interface SubmittableExtrinsic<ApiType extends ApiTypes, R extends ISubmittableResult = ISubmittableResult> extends Extrinsic {
  dryRun (account: AddressOrPair, options?: Partial<SignerOptions>): SubmittableDryRunResult<ApiType>;

  paymentInfo (account: AddressOrPair, options?: Partial<SignerOptions>): SubmittablePaymentResult<ApiType>;

  send (): SubmittableResultResult<ApiType>;

  send (statusCb: Callback<R>): SubmittableResultSubscription<ApiType, R>;

  /**
   * @deprecated
   */
  sign (account: IKeyringPair, _options?: Partial<SignerOptions>): this;

  signAsync (account: AddressOrPair, _options?: Partial<SignerOptions>): PromiseOrObs<ApiType, this>;

  signAndSend (account: AddressOrPair, options?: Partial<SignerOptions>): SubmittableResultResult<ApiType, R>;

  signAndSend (account: AddressOrPair, statusCb: Callback<R>): SubmittableResultSubscription<ApiType>;

  signAndSend (account: AddressOrPair, options: Partial<SignerOptions>, statusCb?: Callback<R>): SubmittableResultSubscription<ApiType, R>;

  withResultTransform (transform: (input: ISubmittableResult) => ISubmittableResult): this;
}