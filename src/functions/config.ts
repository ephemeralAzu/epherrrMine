import * as fs from 'fs'
const defaultConfig = new Array()
defaultConfig["PLAYER_ID"]="-1;"
defaultConfig["PLAYER_UUID"]="-1";
defaultConfig["PLAYER_NICKNAME"]="-1;"
defaultConfig["PLAYER_TOKEN"]="-1;"
defaultConfig["UPDATE_CHANNEL"]="release;"
defaultConfig["APP_DIR"]="unset;"


let config = new Object()
export function get(){
  if(JSON.stringify(config).length <= 3){
    read()
  }
  return config
}

function globalize(config){
  if(process.env.DEBUG_MODE)console.log("Globalizing config");
  if(config.APP_DIR === "unset"){
    config.APP_DIR = process.env.APP_DIR
  }

  if(config.UPDATE_CHANNEL === "unset"){
    config.UPDATE_CHANNEL = "release"
    process.env.UPDATE_CHANNEL = "release"
  }else{
    process.env.UPDATE_CHANNEL = config.UPDATE_CHANNEL
  }
return config
}

export function read() {
  if(process.env.DEBUG_MODE)console.log("Reading config");
  if(!fs.existsSync(process.env.APP_DIR + '\\default.conf')){
    reset()
    return
  }
  let cfgStr = fs.readFileSync(process.env.APP_DIR + '\\default.conf').toString()
  let vars = cfgStr.replace(/\r?\n|\r/g, '')
  let variables = vars.split(";")
  let cfg = new Array()
  variables.forEach(variable => {
      cfg[variable.split("=")[0]] = variable.split("=")[1]
  });
  cfg = globalize(cfg)
  config = cfg
  if(process.env.DEBUG_MODE)console.log(cfg);
  return
}

export async function reset(){
  if(process.env.DEBUG_MODE)console.log("Resetting config");
  defaultConfig.forEach(arg =>{
    fs.writeFileSync(process.env.APP_DIR + '\\default.conf', arg)
  })
}
