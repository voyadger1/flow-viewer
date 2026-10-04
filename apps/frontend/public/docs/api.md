# API Documentation

In addition to the web interface, data can also be retrieved via the API. This can be useful for setting up notifications or integrating third-party analytics scripts.

## HTTP

Base URL for the API: `<BASE_URL>/api`

---

### Sessions

Retrieving a list of sessions and creating new ones

#### GET sessions
`<BASE_URL>/api/sessions`

Get a list of sessions

##### Query parameters

| Parameter | Type     | Required   | Default | Description   |
|-----------|----------|------------|---------|---------------|
| `limit`   | `number` | ❌          | `20`    | Count on page |
| `page`    | `number` | ❌          | `1`     | Page          |


##### Response `200 OK`

```json
{
  "items": [
    {
      "id": 21,
      "status": "FAILED",
      "startTime": 1790715910607,
      "completedTime": 1790715924527,
      "workflowName": "develop-plugin",
      "scriptName": "main.nf",
      "runName": "confident_rutherford",
      "runBy": "alexey"
    },
    ...
  ],
  "total": 21,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```


| Field                     | Type        | Description         |
|---------------------------|-------------|---------------------|
| `total`                   | `number`    | Total records       |
| `page`                    | `number`    | Current page        |
| `limit`                   | `number`    | Entries on the page |
| `totalPages`              | `number`    | Total pages         |
| `items`                   | `Session[]` | Session array       |
| `items[].id`              | `number`    | Session ID          |
| `items[].status`          | `string`    | Status              |
| `items[].startTime`       | `number`    | Start time          |
| `items[].workflowName`    | `string`    | WorkFlow            |
| `items[].scriptName`      | `string`    | Startup script name |
| `items[].runName`         | `string`    | Launch name         |
| `items[].runBy`           | `string`    | RunName             |

#### GET sessions/filters
`<BASE_URL>/api/sessions/filters`

Get a list of filters

##### Response `200 OK`

```json
{
  "runsBy": [
    "developer-1",
    "alexey"
  ],
  "workFlows": [
    "develop-plugin",
    "workflow-2"
  ]
}
```


| Field       | Type       | Description                       |
|-------------|------------|-----------------------------------|
| `runsBy`    | `string[]` | List of all session initiators    |
| `workFlows` | `string[]` | List of all workflows             |


---

### Session

#### GET session
`<BASE_URL>/api/sessions/:id`

Retrieve a specific session

##### Path parameters

| Parameter  | Type     | Required  | Default        | Description |
|------------|----------|-----------|----------------|-------------|
| `id`       | `number` | ✅         | —              | Session Id  |


##### Response `200 OK`

```json
{
  "id": 2,
  "status": "SUCCEEDED",
  "startTime": 1790280969842,
  "completedTime": 1790280974165,
  "uniqueId": "9884abd7-c05b-4ef5-8469-f57ba77f0975",
  "workflowName": "develop-plugin",
  "sessionInfo": "some markdown description",
  "scriptName": "main.nf",
  "runName": "nostalgic_linnaeus",
  "runBy": null,
  "profile": null,
  "ansiLog": false,
  "binDir": null,
  "bucketDir": null,
  "workDir": "/nextflow/nextflow-test/work",
  "commandLine": "nextflow main.nf -with-docker -ansi-log false",
  "commitId": null,
  "poolSize": 8,
  "resolvedConfig": null,
  "createdAt": "2026-09-24T20:16:09.000Z",
  "updatedAt": "2026-09-24T20:16:14.000Z"
}
```


| Поле             | Тип        | Описание                                            |
|------------------|------------|-----------------------------------------------------|
| `id`             | `number`   | Session Id                                          |
| `status`         | `string`   | Status                                              |
| `startTime`      | `number`   | Process start time (UNIX)                           |
| `completedTime`  | `number`   | Process completion time (UNIX)                      |
| `uniqueId`       | `string`   | Nextflow-generated ID                               |
| `workflowName`   | `string`   | Session workflow                                    |
| `sessionInfo`    | `string`   | Description in Markdown format                      |
| `scriptName`     | `string`   | Startup file name                                   |
| `runName`        | `string`   | Launch name                                         |
| `runBy`          | `string`   | Who started the process (developer or server name)  |
| `profile`        | `string`   | Profile                                             |
| `ansiLog`        | `boolean`  | Log formatting                                      |
| `binDir`         | `string`   | Path to the bin folder                              |
| `bucketDir`      | `string`   | Path to the bucket folder                           |
| `workDir`        | `string`   | Path to the working directory                       |
| `commandLine`    | `string`   | Pipeline launch script                              |
| `commitId`       | `string`   | Commit SHA-hash                                     |
| `poolSize`       | `number`   | Thread pool size                                    |
| `resolvedConfig` | `number`   | Final launch configuration                          |
| `createdAt`      | `string`   | Creation date                                       |
| `updatedAt`      | `string`   | Last updated                                        |


---

### Processes

#### GET processes
`<BASE_URL>/api/processes/:sessionId/processes`

Get a list of session processes

##### Path parameters

| Parameter    | Type     | Required  | Default | Description  |
|--------------|----------|-----------|---------|--------------|
| `sessionId`  | `number` | ✅         | —       | Session Id   |


##### Response `200 OK`

```json
[
  {
    "id": 133,
    "vertexId": 0,
    "sessionId": 21,
    "processId": 1,
    "label": "MULTIPLY",
    "type": "PROCESS",
    "status": "SUCCEEDED",
    "startTime": 1790715911121,
    "completeTime": 1790715918253,
    "createdAt": "2026-09-29T21:05:10.000Z",
    "updatedAt": "2026-09-29T21:05:18.000Z"
  },
  ...
]
```


| Поле               | Тип        | Описание                            |
|--------------------|------------|-------------------------------------|
| `id`               | `number`   | Process Id                          |
| `vertexId`         | `number`   | Node ID (for graph display)         |
| `sessionId`        | `number`   | Session Id                          |
| `processId`        | `number`   | Process node ID (for graph display) |
| `label`            | `string`   | Process name                        |
| `type`             | `string`   | Process type                        |
| `status`           | `string`   | Process status                      |
| `startTime`        | `number`   | Process start time (UNIX)           |
| `completeTime`     | `number`   | Process completion time (UNIX)      |
| `createdAt`        | `string`   | Creation date                       |
| `updatedAt`        | `string`   | Last updated                        |

#### GET edges
`<BASE_URL>/api/processes/:sessionId/edges`

Get a list of process connections for the session.

##### Path parameters

| Parameter    | Type     | Required | Default | Description |
|--------------|----------|----------|---------|-------------|
| `sessionId`  | `number` | ✅        | —       | Session Id  |


##### Response `200 OK`

```json
{
  "sessionId": 21,
  "edges": [
    {
      "id": 0,
      "label": "input_file",
      "fromId": null,
      "toId": 0
    },
    ...
  ]
}
```


| Field            | Type     | Description          |
|------------------|----------|----------------------|
| `sessionId`      | `number` | Session Id           |
| `edges`          | `Edge[]` | List of connections  |
| `edges[].id`     | `number` | Connection ID        |
| `edges[].label`  | `string` | Label                |
| `edges[].fromId` | `number` | Source node ID       |
| `edges[].toId`   | `number` | Target node ID       |

---

### Telemetry

#### GET telemetry/process
`<BASE_URL>/api/telemetry/process/:processId`

Get a list of telemetry for a specific process

##### Path parameters

| Parameter    | Type     | Required | Default | Description |
|--------------|----------|----------|---------|-------------|
| `processId`  | `number` | ✅        | —       | Process Id  |


##### Response `200 OK`

```json
{
  "id": 76,
  "sessionId": 21,
  "processId": 133,
  "hash": "a9/fefebe",
  "realtime": 5127,
  "startTime": 1790715911121,
  "completeTime": 1790715918253,
  "cpuPercent": 2.1,
  "cpus": 1,
  "cpu_model": null,
  "mem": 0.1,
  "rss": 12177408,
  "vmem": 17932288,
  "peakRss": 12177408,
  "peakVmem": 17932288,
  "memory": null,
  "rchar": 69444,
  "wchar": 285,
  "readBytes": 0,
  "writeBytes": 25,
  "container": "python",
  "disk": null,
  "module": "[]",
  "exitStatus": 0,
  "hostname": null,
  "inv_ctxt": 1,
  "vol_ctxt": 28,
  "error_action": null,
  "queue": null,
  "scratch": null,
  "createdAt": "2026-09-29T21:05:18.000Z",
  "updatedAt": "2026-09-29T21:05:18.000Z"
}
```

| Поле                  | Тип      | Описание                                              |
|-----------------------|----------|-------------------------------------------------------|
| `id`                  | `number` | Telemetry Id                                          |
| `sessionId`           | `number` | Session Id                                            |
| `processId`           | `number` | Process Id                                            |
| `hash`                | `string` | Task hash (used for the -resume cache)                |
| `realtime`            | `number` | Actual process execution time                         |
| `startTime`           | `number` | Process start time (UNIX)                             |
| `completeTime`        | `number` | Process completion time (UNIX)                        |
| `cpuPercent`          | `number` | CPU usage percentage                                  |
| `cpus`                | `number` | Number of allocated cores                             |
| `cpu_model`           | `string` | CPU model                                             |
| `mem`                 | `number` | Percentage of allocated memory used                   |
| `rss`                 | `number` | Resident Set Size — physical memory in bytes          |
| `vmem`                | `number` | Virtual Memory — virtual memory in bytes              |
| `peakRss`             | `number` | Peak RSS value for the entire duration of the task    |
| `peakVmem`            | `number` | Peak VMEM value for the entire duration of the task   |
| `memory`              | `number` | Memory limit from the memory directive                |
| `rchar`               | `number` | Bytes read via system calls                           |
| `wchar`               | `number` | Bytes written via system calls.                       |
| `readBytes`           | `number` | Bytes read from disk (actual I/O, excluding cache)    |
| `writeBytes`          | `number` | Bytes written to disk (actual I/O)                    |
| `container`           | `string` | Docker container startup                              |
| `disk`                | `number` | Disk limit                                            |
| `module`              | `string` | Environment modules (for HPC)                         |
| `exitStatus`          | `number` | Exit code                                             |
| `hostname`            | `string` | Hostname                                              |
| `inv_ctxt`            | `number` | Invocation context number (for retries)               |
| `vol_ctxt`            | `number` | Volunteer context number (for dynamic tasks)          |
| `error_action`        | `string` | Action on error                                       |
| `queue`               | `number` | Scheduler queue (SLURM partition, SGE queue)          |
| `scratch`             | `number` | Scratch directory                                     |
| `createdAt`           | `string` | Creation date                                         |
| `updatedAt`           | `string` | Last updated                                          |

#### GET telemetry/session
`<BASE_URL>/api/telemetry/session/:sessionId`

Get a list of telemetry for all session processes.

##### Path parameters

| Parameter   | Type     | Required      | Default | Description |
|-------------|----------|---------------|---------|-------------|
| `sessionId` | `number` | ✅             | —       | Session Id  |


##### Response `200 OK`

```json
[
  {
    "id": 76,
    "sessionId": 21,
    "processId": 133,
    "hash": "a9/fefebe",
    "realtime": 5127,
    "startTime": 1790715911121,
    "completeTime": 1790715918253,
    "cpuPercent": 2.1,
    "cpus": 1,
    "cpu_model": null,
    "mem": 0.1,
    "rss": 12177408,
    "vmem": 17932288,
    "peakRss": 12177408,
    "peakVmem": 17932288,
    "memory": null,
    "rchar": 69444,
    "wchar": 285,
    "readBytes": 0,
    "writeBytes": 25,
    "container": "python",
    "disk": null,
    "module": "[]",
    "exitStatus": 0,
    "hostname": null,
    "inv_ctxt": 1,
    "vol_ctxt": 28,
    "error_action": null,
    "queue": null,
    "scratch": null,
    "createdAt": "2026-09-29T21:05:18.000Z",
    "updatedAt": "2026-09-29T21:05:18.000Z"
  },
  ...
]
```

#### GET telemetry/workflow/processes
`<BASE_URL>/api/telemetry/workflow/:workflow/processes`

Get a list of all workflow processes (not just from the current session, but from all sessions of the given workflow).

##### Path-параметры

| Parameter    | Type     | Required      | Default        | Description   |
|--------------|----------|---------------|----------------|---------------|
| `workflow`   | `string` | ✅             | —              | Workflow name |


##### Response `200 OK`

```json
[
  "MULTIPLY",
  "MY_PROCESS",
  "SUBTRACT",
  "CONSUMER_1",
  "CONSUMER_2",
  "CONSUMER_3"
]
```

#### GET telemetry/workflow/process
`<BASE_URL>/api/telemetry/workflow/:workflow/processes/:processName`

Get analytics for this process across all workflows (last 50 runs).

##### Path parameters

| Parameter      | Type     | Required      | Default        | Description   |
|----------------|----------|---------------|----------------|---------------|
| `workflow`     | `string` | ✅             | —              | Workflow name  |
| `processName`  | `string` | ✅             | —              | Process name  |


##### Response `200 OK`

```json
[
  {
    "realtime": 5127,
    "cpuPercent": 2.1,
    "mem": 0.1,
    "rss": 12177408,
    "vmem": 17932288,
    "peakRss": 12177408,
    "peakVmem": 17932288,
    "memory": null,
    "rchar": 69444,
    "wchar": 285,
    "readBytes": 0,
    "writeBytes": 25,
    "sessionId": 21,
    "runName": "confident_rutherford",
    "processId": 133,
    "processName": "MULTIPLY"
  },
  ...
]
```

---

### Artifacts

#### GET artifacts
`<BASE_URL>/api/artifacts/:sessionId`

Get a list of artifacts

##### Path parameters

| Parameter    | Type     | Required      | Default        | Description |
|--------------|----------|---------------|----------------|-------------|
| `sessionId`  | `number` | ✅             | —              | Session Id  |


##### Response `200 OK`

```json
[
  {
    "id": 45,
    "sessionId": 21,
    "processId": 133,
    "name": "multiplied.txt",
    "uri": "/nextflow/nextflow-test/work/a9/fefebecd0f7bb58a23e87a27a62089/multiplied.txt",
    "size": 25,
    "permissions": "rw-r--r--",
    "fileSystem": "sun.nio.fs.MacOSXFileSystem@2cfbf51b",
    "data": "30.0\n16.0\n-8.0\n14.0\n56.0\n",
    "hash": "a9/fefebecd0f7bb58a23e87a27a62089",
    "createdAt": "2026-09-29T21:05:18.000Z",
    "updatedAt": "2026-09-29T21:05:18.000Z"
  },
  ...
]
```


| Field          | Type     | Description                                                                  |
|----------------|----------|------------------------------------------------------------------------------|
| `id`           | `number` | Artifact Id                                                                  |
| `sessionId`    | `number` | Session Id                                                                   |
| `processId`    | `number` | Process Id (for graph display)                                               |
| `name`         | `string` | File name                                                                    |
| `uri`          | `string` | Full path                                                                    |
| `size`         | `number` | Size in bytes                                                                |
| `permissions`  | `string` | Access rights                                                                |
| `fileSystem`   | `string` | File system                                                                  |
| `data`         | `string` | File content (first 512 bytes, but this can be changed in the configuration) |
| `hash`         | `string` | Artifact hash (needed to link it to the process that created it)             |
| `createdAt`    | `string` | Creation date                                                                |
| `updatedAt`    | `string` | Last updated                                                                 |

