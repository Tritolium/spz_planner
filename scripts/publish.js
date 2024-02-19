const { execSync, exec } = require('child_process')

const version = process.argv[2]
const strippedVersion = version.split(".")[0] + "." + version.split(".")[1]

console.log("Setting version to " + version)

if(version.split(".")[2] === "0")
    exec(`sed -i 's/const version = .*/const version = "${strippedVersion}"/' src/App.js`)
else{
    // version is a patch, so there already is a branch for it. Switch to it
    execSync("git fetch")
    execSync(`git switch ${strippedVersion}`)
    execSync("git pull")
    exec(`sed -i 's/const version = .*/const version = "${version}"/' src/App.js`)
}

exec(`sed -i 's/"version": .*/"version": "${version}",/' package.json`)
exec(`sed -i 's/"version": .*/"version": "${version}",/' public/manifest.json`)
execSync("git add src/App.js package.json public/manifest.json")
execSync(`git commit -m "Planer ${version}"`)
execSync(`git tag -a ${version} -m "Planer ${version}"`)
execSync("git push origin master")
execSync(`git push origin ${version}`)

if(version.split(".")[2] === "0"){
    execSync(`git branch -c ${strippedVersion}`)
    exec(`git push origin ${strippedVersion}`)
}
