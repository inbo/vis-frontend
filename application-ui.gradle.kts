import com.moowork.gradle.node.npm.NpmTask

plugins {
  `java-library`
  id("com.github.node-gradle.node")
}

node {
  version = "14.15.1"
  npmVersion = "6.14.8"
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

    archiveBaseName.set("visuilocal")

    from("dist/local") {
      into("/")
    }

    from("server") {
      into("/")
    }
  }

  val distZipDev by creating(Zip::class) {
    dependsOn("npm_run_builddev")

    archiveBaseName.set("visbirdsuidev")

    from("dist/dev") {
      into("/")
    }

    from("server") {
      into("/")
    }
  }

  val distZipUat by creating(Zip::class) {
    dependsOn("npm_run_builduat")

    archiveBaseName.set("visbirdsuiuat")

    from("dist/uat") {
      into("/")
    }

    from("server") {
      into("/")
    }
  }

  val distZipProd by creating(Zip::class) {
    dependsOn("npm_run_buildprod")

    archiveBaseName.set("visbirdsuiprod")

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

