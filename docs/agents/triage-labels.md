# Triage labels

Map each canonical triage role to the following local ticket status:

| Canonical role | Local status | Meaning |
| --- | --- | --- |
| `needs-triage` | `needs-triage` | Maintainer evaluation is needed. |
| `needs-info` | `needs-info` | More information is needed from the reporter. |
| `ready-for-agent` | `ready-for-agent` | Fully specified and ready for an agent. |
| `ready-for-human` | `ready-for-human` | Human implementation is required. |
| `wontfix` | `wontfix` | The request will not be implemented. |

When a skill names a triage role, write its mapped string in the ticket's `**Status:**` line. Execution states and blocking rules are defined in [issue tracker rules](issue-tracker.md).
