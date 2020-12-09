const {exec} = require("child_process");

const command = [
    `"${env.pathToMaya}\\Render.exe" -r arnold -ai:lve 3 `,
    `-s ${frame} -e ${frame} -x ${pluginSettings.resolutionX} -y ${pluginSettings.resolutionY} -ai:threads ${pluginSettings.threads} `,
    `${pluginSettings.pathToMayaScene}`
].join("");

const cp = exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    console.log("\nfinish render");
    finishJob("done", "render finished!");
    // console.log(`stdout: ${stdout}`);
});
console.log("Prepare for rendering!");
cp.stdout.on("data", async (data) => {
    const cols = data.split("|");
    console.log(cols);
    for (let i = 0; i < cols.length; i++) {
        if (cols[i].includes("% d")) {
            console.log(cols[i].substr(2, 4));
            await sendReport("info", {Processing: `${cols[i].substr(2, 4)}`});
        }
    }
    await sendReport("info", {message: data});
});
