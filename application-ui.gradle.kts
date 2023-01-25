import com.moowork.gradle.node.npm.NpmTask

plugins {
  `java-library`
  id("com.github.node-gradle.node")
}

node {
  version = "18.13.0"
  npmVersion = "8.19.3"
  download = true
}

tasks {
  "npm_run_build"(NpmTask::class) {
    inputs.dir(file("src"))
  }

  "npm_run_builddev"(NpmTask::class) {
    inputs.dir(file("src"))
  }

  "npm_run_builduat"(NpmTask::class) {
    inputs.dir(file("src"))
  }

  "npm_run_buildprod"(NpmTask::class) {
    inputs.dir(file("src"))
  }

  val distZipLocal by creating(Zip::class) {
    dependsOn("npm_run_build")

    archiveBaseName.set("vis-ui-local")

    from("dist/local") {
      into("/")
    }

    from("server") {
      into("/")
    }
  }

  val distZipDev by creating(Zip::class) {
    dependsOn("npm_run_builddev")

    archiveBaseName.set("vis-ui-dev")

    from("dist/dev") {
      into("/")
    }

    from("server") {
      into("/")
    }
  }

  val distZipUat by creating(Zip::class) {
    dependsOn("npm_run_builduat")

    archiveBaseName.set("vis-ui-uat")

    from("dist/uat") {
      into("/")
    }

    from("server") {
      into("/")
    }
  }

  val distZipProd by creating(Zip::class) {
    dependsOn("npm_run_buildprod")

    archiveBaseName.set("vis-ui-prod")

    from("dist/prod") {
      into("/")
    }

    from("server") {
      into("/")
    }
  }

  assemble {
    dependsOn(distZipLocal, distZipDev, distZipUat, distZipProd)
  }

}

