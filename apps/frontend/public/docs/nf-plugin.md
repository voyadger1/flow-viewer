# NextFlow Plugin Documentation

Documentation on configuring the Nextflow plugin for collecting pipeline execution information.

The plugin complies with nf-core requirements; it requires no script modifications to operate, allowing you to integrate it into existing pipelines and enjoy real-time statistics collection.

---

## Launch

To launch the plugin, you need to specify the following in `nextflow.config`:

```groovy
plugins {
    id 'nf-flowviewer'
}

flowViewer {
    serverUrl = '<BASE_URL>'
}
```

| Parameter   | Description                                                               |
|-------------|---------------------------------------------------------------------------|
| `serverUrl` | Host for the statistics-gathering web application (http://localhost:3000) |

---

## WorkFlow

WorkFlow is the project name used to link project runs across different devices.

Since a single project can be run on different computers, WorkFlow serves as a connecting link that helps gather aggregated statistics from various runs.

The workflow is defined in the configuration:
```groovy
flowViewer {
    ...
    workflowName = 'project-1'
}
```

---

## Run by

To distinguish the devices from which the script was launched, there is a `RunBy` parameter. It can be specified either in the pipeline configuration or as an environment variable.

The value can be an arbitrary string and serves to specify the name of the specific developer running the script or the name of the server where the execution takes place.

Specifying RunBy via an environment variable:

```shell
export FLOWVIEWER_RUN_BY="developer-1"
```

Specifying RunBy via the config:

```groovy
flowViewer {
    ...
    runBy = 'developer-1'
}
```

> **⚠️ Priority**: 
> a value set via an environment variable takes precedence over a value in the configuration.

---

## Artifacts

Artifacts are files generated during pipeline execution. You can view them in the relevant section of the specific pipeline's details, where a preview is also available.

> **⚠️ Important**: since pipelines can generate massive artifacts (tens of GB in size), it is advisable to limit their collection.

```groovy
flowViewer {
    ...
    artifactMaxSize = 512
}
```

`artifactMaxSize` - The maximum size of data read from the file, in bytes.

*512 bytes by default*

---

## Documentation

You can create Markdown documentation for any NextFlow file; this documentation will be available in the "info" section of the corresponding pipeline.

To create documentation, create an `.md` file next to the Nextflow pipeline launch file, using the same name:

```env
├─ main.nf
└─ main.md
```

OR

```env
├─ dna-seq.nf
└─ dna-seq.md
```

If the plugin does not find a file with the corresponding name, it will use the README.md file located in the same directory as the documentation.

```env
├─ main.nf
└─ README.md
```
