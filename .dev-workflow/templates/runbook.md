# Runbook: <Service> — <Scenario>

## Metadata

| Field | Value |
|-------|-------|
| **Service** | <service name> |
| **Severity** | Critical / Warning |
| **Alert Name** | <alert rule name> |
| **Last Tested** | <YYYY-MM-DD or "Never"> |
| **Owner** | <team or person> |
| **Escalation** | <who to escalate to> |

## Symptoms

How to recognize this issue:

- **Alert**: <alert name> fires in <monitoring platform>
- **Logs**: Look for `<log pattern>` at `error` level
- **User Impact**: <what users experience — errors, slow responses, missing data>
- **Dashboard**: <which dashboard panel shows the problem>

## Diagnosis

Step-by-step investigation:

### 1. Check service health

```bash
# Check if the service is running
curl -s https://<service-url>/health | jq .

# Check recent logs for errors
<log query command — adapt to your logging platform>
```

### 2. Check dependencies

```bash
# Check database connectivity
<db health check command>

# Check external service status
<dependency health check>
```

### 3. Check metrics

```bash
# Check error rate
<metrics query — adapt to your platform>

# Check latency
<metrics query>

# Check resource usage
<CPU/memory/disk query>
```

### 4. Identify root cause

Common causes for this scenario:
- <cause 1>: look for <evidence>
- <cause 2>: look for <evidence>
- <cause 3>: look for <evidence>

## Remediation

### If cause is <cause 1>:

```bash
# Step 1: <action>
<exact command>

# Step 2: <action>
<exact command>
```

### If cause is <cause 2>:

```bash
# Step 1: <action>
<exact command>
```

### If cause is unknown:

1. Restart the service as an immediate mitigation:
   ```bash
   <restart command>
   ```
2. Escalate to <team/person> immediately
3. Preserve logs and metrics for investigation

## Verification

After applying the fix, verify the issue is resolved:

```bash
# 1. Check the alert has cleared
<check alert status>

# 2. Verify health endpoint
curl -s https://<service-url>/health | jq .

# 3. Verify error rate has dropped
<metrics query>

# 4. Send a test request
curl -s -X POST https://<service-url>/api/... | jq .
```

## Escalation

| Condition | Escalate To | Method |
|-----------|------------|--------|
| Issue not resolved in 15 minutes | <senior engineer> | Slack / PagerDuty |
| Data loss confirmed | <engineering lead> | Phone call |
| Security breach suspected | <security team> | Security incident channel |

## Post-Incident

After the issue is resolved:

- [ ] Write an incident report (if severity was critical)
- [ ] Update this runbook with any new findings
- [ ] Create a task to prevent recurrence
- [ ] Update monitoring/alerts if gaps were found
- [ ] Communicate resolution to affected stakeholders

## Prevention

Steps to prevent this issue from recurring:

- <preventive measure 1>
- <preventive measure 2>
- <monitoring improvement>

## History

| Date | Incident | Root Cause | Resolution Time |
|------|----------|-----------|----------------|
| <date> | <brief description> | <cause> | <duration> |
