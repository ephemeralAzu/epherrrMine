import * as fs from 'fs'
let config_example = 
  "DEBUG_MODE=false;\n" +
  "PLAYER_ID=NULL;\n" +
  "PLAYER_UUID=NULL;\n" +
  "PLAYER_NICKNAME=NULL;\n" +
  "PLAYER_TOKEN=NULL;\n" +
  "UPDATE_CHANNEL=release;\n" +
  "APP_DIR=" + process.env.APP_DIR + ";"

let config = new Array()

export function get(){
  return read()
}
export function resetConfig() {
  if(process.env.DEBUG_MODE) console.log("Config corrupted - resetting");

    fs.writeFileSync(process.env.APP_DIR + '\\default.conf', config_example)

    config = read()
    return config
}

export function read() {
  if(fs.existsSync(process.env.APP_DIR + '\\default.conf')){
    let cfgStr = fs.readFileSync(process.env.APP_DIR + '\\default.conf').toString()
    let vars = cfgStr.replace(/\r?\n|\r/g, '')
    let variables = vars.split(";")
    let cfg = new Array()

    variables.forEach(variable => {
      cfg[variable.split("=")[0]] = variable.split("=")[1]
      config = cfg
    });
    if(typeof config["DEBUG_MODE"] !== "undefined" && config["DEBUG_MODE"] !== "false"){
      process.env.DEBUG_MODE = "true"
    }
    return config
  }else{    
    return resetConfig()
  }
}
