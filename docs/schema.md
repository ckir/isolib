# Canonical Event Schema (isolib)

**Mandatory fields**
- `timestamp` — epoch milliseconds (UTC)
- `level` — one of: `fatal`, `error`, `warn`, `info`, `debug`, `trace`
- `app` — application name (default: executable folder)
- `message` — human-readable message

**Optional**
- `extras` — object containing all other metadata:
  - `domain`, `service`, `instance_id`, `trace_id`, `span_id`
  - `telemetry` — object with process/host metrics
  - `serialized_error` — structured error object

**Notes**
- Internal timestamps are UTC epoch ms. Transports may render timezone-aware datetimes.
- All non-mandatory metadata must be placed inside `extras` (object).
