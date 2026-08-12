import type {
  GuidanceExecutionTrace,
} from "./executor";

import type {
  GuidanceResult,
} from "./types";

export interface GuidanceServiceResponse<
  TPayload = Readonly<Record<string, unknown>>,
> {
  readonly result:
    GuidanceResult<TPayload>;
  readonly trace:
    GuidanceExecutionTrace;
}
