import { execSync, exec } from "child_process"

const version = process.argv[2]
const strippedVersion = version.split(".")[0] + "." + version.split(".")[1]

console.log("Setting version to " + version)

execSync("git fetch")

if(version.split(".")[2] === "0"){
	execSync("git switch master")
	execSync("git pull")
	exec(`sed -i 's/const version = .*/const version = "${strippedVersion}"/' src/App.jsx`)
	exec(`sed -i 's/branch: .*/branch: ${strippedVersion}/' .github/workflows/test_stable.yml`)
}else{
	// version is a patch, so there already is a branch for it. Switch to it, if it exists locally
	const branches = execSync("git branch").toString().split("\n")
	if(branches.includes(strippedVersion)){
		console.log("Branch exists locally")
		execSync(`git switch ${strippedVersion}`)
	} else {
		console.log("Branch does not exist locally")
		execSync(`git checkout ${strippedVersion}`)
	}
	execSync("git pull")
	exec(`sed -i 's/const version = .*/const version = "${version}"/' src/App.jsx`)
}

exec(`sed -i 's/"version": .*/"version": "${version.substring(1)}",/' package.json`)
exec(`sed -i 's/"version": .*/"version": "${version}",/' public/manifest.json`)
execSync("git add src/App.jsx package.json public/manifest.json .github/workflows/test_stable.yml")
execSync(`git commit -m "Planer ${version}"`)
execSync(`git tag -a ${version} -m "Planer ${version}"`)
execSync("git push origin")
execSync(`git push origin ${version}`)

if(version.split(".")[2] === "0"){
	execSync(`git branch -c ${strippedVersion}`)
	exec(`git push origin ${strippedVersion}`)
}

// switch back to master
execSync("git switch master")
