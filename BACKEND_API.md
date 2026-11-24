# Suggested API contract for backend teammate

Base URL example: `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard/stats` | Dashboard counts |
| GET | `/lost-reports` | List lost reports |
| POST | `/lost-reports` | Create lost report |
| GET | `/found-reports` | List found reports |
| POST | `/found-reports` | Create found report |
| GET | `/matches` | List possible matches |
| PATCH | `/matches/:id/review` | Confirm or reject a match |
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id/read` | Mark notification read |
| PATCH | `/items/:id/return` | Mark an item returned |
| GET | `/history` | List historical reports |

## Suggested report fields
`itemName`, `category`, `color`, `description`, `route`, `busTime`, `reportDate`, `reporterName`, `phone`, `status`.

Lost and found reports should be stored separately or with a clear `type` field. Matching should compare multiple clues (category, color, route, time/date, description), not require exact description equality.

## Review safety rule
A match is only a suggestion. `PATCH /matches/:id/review` should accept a decision such as `{ "decision": "confirmed" }` or `{ "decision": "rejected" }`. Only after Mr. Alam confirms should staff contact the owner and arrange handover. Mark an item returned only after the physical handover is completed.
