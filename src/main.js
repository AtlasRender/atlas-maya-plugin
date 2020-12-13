const {exec} = require("child_process");

const pathToMaya = env.pathToMaya.replace(/"/g, "\\\"");
const pathToMayaScene = pluginSettings.pathToMayaScene.replace(/"/g, "\\\"");
const threads = pluginSettings.threads;
const resolutionX = pluginSettings.resolutionX;
const resolutionY = pluginSettings.resolutionY;
const outputFolder = pluginSettings.outputFolder;

const command = [
    `"${pathToMaya}\\Render.exe" -r arnold -ai:lve 3 `,
    `-preRender "setAttr "defaultRenderGlobals.modifyExtension" 1; setAttr "defaultRenderGlobals.startExtension" ${renumbered};" `,
    `-s ${frame} -e ${frame} -x ${resolutionX} -y ${resolutionY} -ai:threads ${threads} -rd ${outputFolder} `,
    `"${pathToMayaScene}"`
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
            if(!isNaN(cols[i].substr(2, 3))){
                console.log(cols[i].substr(2, 3));
                await sendReport("info", {Processing: `${cols[i].substr(2, 4)}`});
            }
        }
    }
    await sendReport("info", {message: data});
});
